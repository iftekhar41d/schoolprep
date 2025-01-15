import React, {useState, useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { QuizContext } from './QuizContext';


function QuizReview() {
    const {quizState, setQuizState, score, setScore,totalQuestions, setTotalQuestions,quizStartTime, setQuizStartTime} = useContext(QuizContext);
    const navigate = useNavigate();
  
    const loadQuizScreen = () => {
        setQuizState("start");
        setScore(0);
        setQuizStartTime(new Date().toISOString());
        //setTotalQuestions(0);
    };

    const loadDashboard = () => {
      navigate("/dashboard");
  };

  return (    
  <div className='d-flex justify-content-center align-items-center quiz-menu'>
      <div>
        <h4 className='custom-subheader'>QuizReview</h4>
        <p>Total number of questions:
          <span className='review-text'>  
            {totalQuestions}
          </span>
        </p>
        <p>Total score: 
          <span className='review-text'>
            {score}
          </span> 
        </p>
        <p>Accuracy: 
          <span className='review-text'>
            {Math.round(score*100/totalQuestions)}%
          </span> 
        </p>
        <div>
          <button className='btn btn-secondary me-3 mt-2' onClick={loadQuizScreen}>Retake Quiz</button>
          <button className='btn btn-primary me-3 mt-2' onClick={loadDashboard}>Go to Dashboard</button>
        </div>
      </div>
      <div >
         <img src='/cartoon-1.png' alt='goblin' className='quiz-review-image'/>
      </div>
    </div>
  )
}

export default QuizReview