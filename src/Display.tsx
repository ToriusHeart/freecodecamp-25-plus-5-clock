import { DisplayState, formatTime } from "./helpers";
import {FaPause, FaPlay, FaUndo} from 'react-icons/fa';

interface DisplayProps {
    displayState: DisplayState,
    reset: () => void;
    startStop: (displayState: DisplayState) => void;
}

const Display: React.FC<DisplayProps> = ({
    displayState,
    reset,
    startStop
}) => {
    return (
        <div className="display">
            <p className="label" id="timer-label">{displayState.timeType}</p>
            <span 
                id="time-left" 
                style={{ color: `${displayState.timerRunning ? "red" : "white"}` }}
            >
                {formatTime(displayState.time)}
            </span>
            <div>
                <button id="start_stop" onClick={() => startStop(displayState)}>
                    {displayState.timerRunning ? <FaPause /> : <FaPlay />}
                </button>
                <button id="reset" onClick={reset}>
                    <FaUndo />
                </button>
            </div>
        </div>
    )
}

export default Display;