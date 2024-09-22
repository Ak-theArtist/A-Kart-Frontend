import React, { useState, useEffect } from 'react';
import './DigitalClock.css';
import useIntersectionObserver from '../Hooks/Hooks';

const DigitalClock = (props) => {
    const [time, setTime] = useState(new Date());
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - startTime) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        useIntersectionObserver('.animate-up', 'show');
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        const strTime = `${hours.toString().padStart(2, '0')}:${minutes}: ${ampm}`;
        return strTime;
    };

    const formatElapsedTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m ` : ''}${secs}s`;
    };

    const getElapsedTimeColor = (seconds) => {
        if (seconds < 1800) {
            return 'green';
        } else if (seconds < 3600) {
            return 'linear-gradient(to right, green, yellow)';
        } else {
            return 'red';
        }
    };

    return (
        <div className='digital-clock animate-up'>
            {/* <div id="timer" style={{ color: getElapsedTimeColor(elapsedTime) }}>
                Time spent: {formatElapsedTime(elapsedTime)}
            </div> */}
            <div style={{backgroundColor: props.mode === 'light' ? 'dark' : 'light'}}>
                {formatTime(time)}
            </div>
        </div>
    );
};

export default DigitalClock;
