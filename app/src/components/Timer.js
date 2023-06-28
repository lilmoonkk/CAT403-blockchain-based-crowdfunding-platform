import React, { useState, useEffect } from 'react';

const Timer = ({ targetDate }) => {
  const [timer, setTimer] = useState('');

  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    /*const targetDateTime = new Date(targetDate);
    //console.log(targetDateTime)
    const deadline = new Date(
      targetDateTime.getFullYear(),
      targetDateTime.getMonth(),
      targetDateTime.getDate(),
      23,
      59,
      0
    ).getTime();*/
    const deadline = targetDate

    let timeLeft = Math.floor((deadline - currentTime) / 1000);
    if (timeLeft < 0) {
      timeLeft = 0;
    }

    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft / (60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 60) % 60);
    const seconds = Math.floor(timeLeft % 60);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { days, hours, minutes, seconds } = calculateTimeLeft();
      setTimer(
        `${days}d ${hours.toString().padStart(2, '0')}h ${minutes
          .toString()
          .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="timer">
      <p>{timer}</p>
    </div>
  );
};

export default Timer;
