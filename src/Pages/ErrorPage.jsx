import React, { useState, useEffect } from 'react';
import './CSS/ErrorPage.css';
import oggy from '../AdminPanel/Components/assets/laugh.gif';
import video from '../AdminPanel/Components/assets/intersteller.mp4';
import Calculator from '../AdminPanel/Components/Calculator/Calculator';
import calculator from '../AdminPanel/Components/assets/calculator.svg';
import TicTacToe from '../Components/Games/TicTacToe';
import game from '../AdminPanel/Components/assets/tictac.webp';
import { CSSTransition } from 'react-transition-group';

const ErrorPage = () => {
    const [showCalculator, setShowCalculator] = useState(false);
    const [showTicTacToe, setShowTicTacToe] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
        setShowTicTacToe(false);
    };

    const toggleTicTacToe = () => {
        setShowTicTacToe(!showTicTacToe);
        setShowCalculator(false);
    };

    const hideHeader = showCalculator || showTicTacToe;

    return (
        <>
            <div className='error-page text-light'>
                <span className="toggle-calculator-button" onClick={toggleCalculator}>
                    <img src={calculator} className='calculator-img' />
                    {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
                </span>
                <CSSTransition
                    in={showCalculator}
                    timeout={300}
                    classNames="transition"
                    unmountOnExit
                >
                    <Calculator />
                </CSSTransition>

                <span className="toggle-game-button" onClick={toggleTicTacToe}>
                    <img src={game} className='game-img' />
                    {showTicTacToe ? 'Close TicTacToe' : 'Play TicTacToe'}
                </span>
                <CSSTransition
                    in={showTicTacToe}
                    timeout={300}
                    classNames="transition"
                    unmountOnExit
                >
                    <TicTacToe />
                </CSSTransition>
                <video className='video' autoPlay={true} muted loop id="myVideo">
                    <source src={video} type="video/mp4" />
                </video>
                {!hideHeader && (
                    <div className='message'>
                        <h4 className='text-center'>Error (404) You are just an ordinary user,<br /> You can't access this page.</h4>
                        <img className='gif' src={oggy} alt="" />
                    </div>
                )}
            </div>
        </>
    );
};

export default ErrorPage;
