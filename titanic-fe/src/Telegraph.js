import React, { useState } from 'react';

import './Telegraph.css';

const ENG_STATUSES = {
    STOP: 'STOP',
    ASTERN_FULL: 'ASTERN_FULL',
    ASTERN_HALF: 'ASTERN_HALF',
    ASTERN_SLOW: 'ASTERN_SLOW',
    ASTERN_DEAD_SLOW: 'ASTERN_DEAD_SLOW',
    STAND_BY_1: 'STAND_BY_1',
    STAND_BY_2: 'STAND_BY_2',
    AHEAD_DEAD_SLOW: 'AHEAD_DEAD_SLOW',
    AHEAD_SLOW: 'AHEAD_SLOW',
    AHEAD_HALF: 'AHEAD_HALF',
    AHEAD_FULL: 'AHEAD_FULL'
};

const Telegraph = () => {

    const [engineStatus, setEngineStatus] = useState(ENG_STATUSES.STOP);


    const sendCommand = (command) => {
        const requestOptions = {
            method: 'POST',
        };

        fetch(`/api/telegraph/${command}`, requestOptions);
    }

    const onClick = (action) => {
        if(action === engineStatus) return;
        console.log(`Engine Action Changed: ${action}`);
        setEngineStatus(action);
        sendCommand(action);
    };


    return (
        <div className="EngineOrderTelegraph">
            <div className="control ">
                <div>
                    Astern
                </div>
                <div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.ASTERN_FULL ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.ASTERN_FULL)} 
                    >
                            Full
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.ASTERN_HALF ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.ASTERN_HALF)} 
                    >
                        Half
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.ASTERN_SLOW ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.ASTERN_SLOW)} 
                    >
                        Slow
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.ASTERN_DEAD_SLOW ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.ASTERN_DEAD_SLOW)} 
                    >
                        Dead Slow
                    </div>
                </div>
            </div>
            <div className="control">
                <div>                
                    <div 
                        className={`${engineStatus === ENG_STATUSES.STAND_BY_1 ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.STAND_BY_1)} 
                    >
                        Stand By
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.STOP ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.STOP)} 
                    >
                        Stop
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.STAND_BY_2 ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.STAND_BY_2)} 
                    >
                        Stand By
                    </div>
                </div>
            </div>
            <div className="control">
                <div>Ahead</div>
                <div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.AHEAD_DEAD_SLOW ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.AHEAD_DEAD_SLOW)} 
                    >
                        Dead Slow
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.AHEAD_SLOW ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.AHEAD_SLOW)} 
                    >
                        Slow
                    </div>
                    <div  
                        className={`${engineStatus === ENG_STATUSES.AHEAD_HALF ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.AHEAD_HALF)} 
                    >
                        Half
                    </div>
                    <div 
                        className={`${engineStatus === ENG_STATUSES.AHEAD_FULL ? 'selected' : ''} controlMovement`}
                        onClick={() => onClick(ENG_STATUSES.AHEAD_FULL)} 
                    >
                        Full
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Telegraph;