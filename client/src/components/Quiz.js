import React, {useState, useEffect} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import axios from 'axios';
import QuizMenu from './QuizMenu';
import QuizEngine from './QuizEngine';
import QuizReview from './QuizReview';
import { QuizContext } from './QuizContext';


function Quiz() {
  const [quizState, setQuizState] = useState("menu");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);  
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isLearningMode, setIsLearningMode] = useState(true);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const { unitid } = useParams(); //get unit id from URL
  const location = useLocation();
  const { subject, unit } = location.state || {}; // Destructure values from state  
     
  return (
    <div>
      <h2 className="text-center mt-5 custom-page-title">Exercise: {subject}: {unit}</h2>
      <QuizContext.Provider value={{
        quizState, 
        setQuizState, 
        score, 
        setScore, 
        totalQuestions, 
        setTotalQuestions, 
        isTimerOn, 
        setIsTimerOn, 
        isLearningMode, 
        setIsLearningMode,
        quizStartTime, 
        setQuizStartTime }}>
      {quizState==="menu" && <QuizMenu unitid={unitid} />}
      {quizState==="start" && <QuizEngine />}
      {quizState==="end" && <QuizReview />}
      </QuizContext.Provider>
    </div>
  )
}

export default Quiz;