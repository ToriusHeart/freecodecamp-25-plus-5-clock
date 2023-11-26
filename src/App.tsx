import { useState, useEffect } from 'react'
import './App.css'
import { DisplayState } from './helpers';
import TimeSetter from './TimeSetter';
import Display from './Display';

const defaultBreakTime = 5 * 60; //min * sec
const defaultSessionTime = 25 * 60; // min * sec
const min = 60; // sec
const max = 60 * 60; // min * sec
const interval = 60; // sec

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false
  });

  useEffect(() => {
    let timerID: number;
    if(!displayState.timerRunning) return;
    else {
      timerID = window.setInterval(decrementDisplay, 1000)
    }

    return () => {
      window.clearInterval(timerID);
    }


  }, [displayState.timerRunning])

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setDisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime
      }));
    }
  }, [displayState, breakTime, sessionTime])

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning
    }))
  }
  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  }
  
  const changeBreakTime = (time: number) => {
    if(displayState.timerRunning) return;
    setBreakTime(time);
  }
  const changeSessionTime = (time:number) => {
    if(displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false
    })
  }

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1
    }))
  }

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <p className="label" id="break-label">Break Length</p>
          <TimeSetter
            time={breakTime}
            setTime={changeBreakTime}
            min={min}
            max={max}
            interval={interval}
            type="break"
          />
        </div>
        <div className="session">
          <p className="label" id="session-label">Session Length</p>
          <TimeSetter 
            time={sessionTime}
            setTime={changeSessionTime}
            min={min}
            max={max}
            interval={interval}
            type="session"
          />
        </div>
      </div>
      <Display 
        displayState={displayState}
        startStop={startStop}
        reset={reset}
      />
      <audio id="beep" src={'./alarm_sound.mp3'}/>
    </div>
  )
}

export default App
