import React, { useState, useEffect } from "react";

const TimerComponent = ({isTimerOn, timeLeft}) => {
  const [currentTime, setCurrentTime] = useState(timeLeft);

    // Sync `currentTime` state with `timeLeft` prop when `timeLeft` changes
    useEffect(() => {
      setCurrentTime(timeLeft);
    }, [timeLeft]);

  // Countdown logic
  useEffect(() => {
    let timer;
    if (isTimerOn && currentTime > 0) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => prevTime - 1);
      }, 1000); // Decrease time by 1 second
    } else if (currentTime === 0) {
      clearInterval(timer); // Clear timer when it reaches 0
    }
    return () => clearInterval(timer); // Cleanup on unmount or state change
  }, [isTimerOn, currentTime]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container text-center">      
      {isTimerOn && (
        <div className="mt-1 mb-3">          
          {/* <p>Time Left: {formatTime(currentTime)}</p> */}
          <div className="timer">
          <h5>
              <i className="fas fa-clock timer-margin"></i>
              {formatTime(currentTime)}
          </h5>
          </div>          
        </div>
      )}
    </div>
  );
};

export default TimerComponent;
