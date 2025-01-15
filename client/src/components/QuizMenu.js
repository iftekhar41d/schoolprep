import React, {useState, useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { QuizContext } from './QuizContext';
import ProgressBar from './Progressbar';

function QuizMenu(props) {
    const {quizState, setQuizState,totalQuestions, setTotalQuestions, isTimerOn, setIsTimerOn,isLearningMode, setIsLearningMode, quizStartTime, setQuizStartTime} = useContext(QuizContext);
    const questionLength = 10;
    const quizTime = questionLength * 1;
    const navigate = useNavigate();     
  
    const loadQuizScreen = () => {
        setQuizState("start");

        //set quiz start time to current time
        setQuizStartTime(new Date().toISOString());
    };

    const loadDashboard = () => {
      navigate("/dashboard");
    };

    // Toggle the timer switch
    const handleTimerSwitch = () => {
      setIsTimerOn((prev) => !prev);
    };

        // Toggle the learning mode switch
    const handleLearningSwitch = () => {
      setIsLearningMode((prev) => !prev);
    };

  return (
    <div className='d-flex justify-content-center align-items-center quiz-menu'>
      <div>
        <h4 className='custom-subheader'> Quiz Configuration </h4>
        <div className='timer-switchcontrol d-flex align-items-center'>
          <p>Set timer</p>
          <div className="form-check form-switch my-3 large-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="timerSwitch"
              checked={isTimerOn}
              onChange={handleTimerSwitch}
            />
          </div>
        </div>
        <div className='timer-switchcontrol d-flex align-items-center'>
          <p>Show explanation</p>
          <div className="form-check form-switch my-3 large-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="learningModeSwitch"
              checked={isLearningMode}
              onChange={handleLearningSwitch}
            />
          </div>
        </div>
        
        <div>
          <button className='btn btn-primary me-3 mt-2' onClick={loadQuizScreen}>Start Quiz</button>
          <button className='btn btn-secondary me-3 mt-2' onClick={loadDashboard}>Go to Dashboard</button>
        </div>
        </div>
    </div>

  )
}

export default QuizMenu;