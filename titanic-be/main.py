from flask import Flask, request, jsonify
from enum import Enum

import pwmio
import time
import board
import digitalio
from adafruit_motor import motor

class EngineDirection(Enum):
    STOP = 0
    AHEAD = 1
    ASTERN = -1

    def __str__(self):
        return str(self.name)

class EngineSpeed(Enum):
    STOP = 0
    FULL = 1
    HAlF = .5
    SLOW = .25
    DEAD_SLOW = .1

    def __str__(self):
        return str(self.name)

class EngineAction:

    def __init__(self, simple_name, direction, speed):
        self.simple_name = simple_name
        self.direction = direction
        self.speed = speed

    def __str__(self):
        return f'{self.simple_name}'

class TelegraphOrder(Enum):
    STOP =  EngineAction('STOP', EngineDirection.STOP, EngineSpeed.STOP)
    ASTERN_FULL = EngineAction('ASTERN_FULL', EngineDirection.ASTERN, EngineSpeed.FULL)
    ASTERN_HALF = EngineAction('ASTERN_HALF', EngineDirection.ASTERN, EngineSpeed.HAlF)
    ASTERN_SLOW = EngineAction('ASTERN_SLOW', EngineDirection.ASTERN, EngineSpeed.SLOW)
    ASTERN_DEAD_SLOW = EngineAction('ASTERN_DEAD_SLOW', EngineDirection.ASTERN, EngineSpeed.DEAD_SLOW)
    STAND_BY_1 = EngineAction('STAND_BY_1', EngineDirection.STOP, EngineSpeed.STOP)
    STAND_BY_2 = EngineAction('STAND_BY_2', EngineDirection.STOP, EngineSpeed.STOP)
    AHEAD_DEAD_SLOW = EngineAction('AHEAD_DEAD_SLOW', EngineDirection.AHEAD, EngineSpeed.DEAD_SLOW)
    AHEAD_SLOW = EngineAction('AHEAD_SLOW', EngineDirection.AHEAD, EngineSpeed.SLOW)
    AHEAD_HALF = EngineAction('AHEAD_HALF', EngineDirection.AHEAD, EngineSpeed.HAlF)
    AHEAD_FULL = EngineAction('AHEAD_FULL', EngineDirection.AHEAD, EngineSpeed.FULL)

    @classmethod
    def from_str(ctr, order: str):
        order = order.upper()
        if order in TelegraphOrder.__members__:
            return TelegraphOrder[order]
        else:
            raise ValueError(f'{order} is not a valid Telegraph Order.')

    def __str__(self):
        return str(self.name)

class Engine:
    # You can use any available GPIO pin on both a microcontroller and a Raspberry Pi.
    # The following pins are simply a suggestion. If you use different pins, update
    # the following code to use your chosen pins.

    def __init__(self):
        print('Creating Engine')
        self.one = pwmio.PWMOut(board.D12)
        self.two = pwmio.PWMOut(board.D13)
        self.engine = motor.DCMotor(self.one, self.two)
        self.engine.decay_mode = (motor.SLOW_DECAY)

    def set_engine_order(self, telegraph_order):
        print(f'Got engine action ${telegraph_order}')
        
        # We want to stop the engine and give it a second to stop
        self.engine.throttle = 0
        time.sleep(1)

        print(f'Engine Speed {telegraph_order.value.speed.value}')
        self.engine.throttle = telegraph_order.value.speed.value * telegraph_order.value.direction.value


class EngineOrderHandler:

    current_order = TelegraphOrder.STOP
    engine = Engine()

    @classmethod
    def send_order(cls, order):
        if not order:
            print('Order cannot be empty')
            return
        if order == cls.current_order:
            print(f'Current order is the same as requested ${order}')
            return
        cls.current_order = order
        cls.engine.set_engine_order(order)

    @classmethod
    def get_order(cls):
        return cls.current_order

def create_app():
    app = Flask(__name__)

    @app.route('/api/telegraph', methods=['GET'])
    def get_current_telegraph_order():
        return jsonify(str(EngineOrderHandler.get_order()))

    @app.route('/api/telegraph/<order>', methods=['POST'])
    def send_telegraph_order(order):
        print(f'Path order: ${order}')
        order_serialized = TelegraphOrder.from_str(order)
        print(f'Order ${order_serialized}')
        EngineOrderHandler.send_order(order_serialized)
        return "", 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run() 