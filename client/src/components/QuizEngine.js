import React, {useState, useEffect, useContext, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { QuizContext } from './QuizContext';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import TimerComponent from './Timer';
import { AuthContext } from './AuthContext';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,

  });

function QuizEngine() {
    const {quizState, setQuizState, score, setScore, totalQuestions, setTotalQuestions, isTimerOn, isLearningMode, quizStartTime, setQuizStartTime} = useContext(QuizContext);
    const { loggedinUserId } = useContext(AuthContext); //get currently loggedin userID  
    const { unitid } = useParams(); //get unit id from URL
    const [questionList, setQuestionList] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [groupedQuestions, setGroupedQuestions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);

    const [currQuestion, setCurrQuestion] = useState(0);
    const [optionChosen, setOptionChosen] = useState(null);
    const [isOptionCorrect, setIsOptionCorrect] = useState(false);
    const navigate = useNavigate();
    
    
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    //load the question list when the component is mounted
    useEffect(()=>{
      const fetchQuestionsByUnit = async () =>{
      
        //if bearer token not found
          if (!token) {
              console.error('No token found');
              return;
          }

          //if token found, make the api call
          try{
              const response = await api.get(`/questions/${unitid}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Replace with cookie reading if using cookies
                },
              });

              //const response = await axios.get(`http://localhost:5000/api/questions/${unitid}`);
              setQuestionList(response.data);
              //console.log(response.data);
              
              //reduce the array to group options by questions
              const formattedData = response.data.reduce((acc, current) => {
                // Check if the question already exists in the accumulator
                const existingQuestion = acc.find(
                    (item) => item.question_id === current.question_id
                );
            
                if (existingQuestion) {
                    // Add the option to the existing question's options array
                    existingQuestion.options.push({
                        option_id: current.option_id,
                        option_text: current.option_text,
                        is_correct: current.is_correct,
                    });
                } else {
                    // Create a new question object with options
                    acc.push({
                        question_id: current.question_id,
                        question: current.question,
                        question_type: current.question_type,
                        media_path: current.media_path,
                        explanation: current.explanation,
                        points: current.points,
                        unit_id: current.unit_id,
                        subject_id: current.subject_id,
                        options: [
                            {
                                option_id: current.option_id,
                                option_text: current.option_text,
                                is_correct: current.is_correct,
                            },
                        ],
                    });
                }
            
                return acc;
            }, []);
            setGroupedQuestions(Object.values(formattedData));
            
            //setTotalQuestions(groupedQuestions.length);                       
  
          }catch(err){
              console.error(err);
              setErrorMessage('Failed to load questions');
          }
  
      };
  
      fetchQuestionsByUnit();        
  },[unitid]); //ensure that the data is fetched only once when the component is mounted and unit selection is changed

  useEffect(() => {
    setTotalQuestions(groupedQuestions.length); //get total number of questions
    setTimeLeft(groupedQuestions.length*60); //calculate timer based on number of questions 
    }, [groupedQuestions]); // This effect runs only when `groupedQuestions` changes  
  

  const handleOptionClick = (optionId, isCorrect)=>{
    //play audio when button is clicked
    if (audioRef.current) {
        audioRef.current.play();
    }

    // Update the score if the selected option is correct
    if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        //alert('correct answer');
    }
    setOptionChosen(optionId);
    setIsOptionCorrect(isCorrect);
  }

  const nextQuestion = ()=>{
    setCurrQuestion((currQuestion) => currQuestion + 1);
    setOptionChosen(null);    
  }

  //function to calculate postgresql-compatible interval
  const calculatePostgresInterval = (startedAt) => {
    const diffMs = new Date() - new Date(startedAt); // Milliseconds difference
    const totalSeconds = Math.floor(diffMs / 1000); // Convert to seconds
    const hours = Math.floor(totalSeconds / 3600); // Calculate hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const seconds = totalSeconds % 60; // Remaining seconds
  
    // Format as PostgreSQL interval string
    return `${hours}:${minutes}:${seconds}`;
  };

  //function to insert exerciseHistory
  const insertExerciseHistory = async (exerciseData) => {
    try {
      //const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/end-exercise`, exerciseData); // Replace with your API URL
      const response = await api.post('/end-exercise', exerciseData);
      //console.log('Exercise history inserted:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error inserting exercise history:', err);
      throw err;
    }
  };
  
  const loadQuizReviewScreen = async () => {
    //insert or update exercise history record
    //create exercise data object
    const exerciseData = {
        user_id: loggedinUserId, // currently logged in userID
        unit_id: unitid,
        is_completed: true,
        total_score: score , 
        total_questions: totalQuestions, 
        correct_answers: score, 
        completion_time: calculatePostgresInterval(quizStartTime), //difference between now and start time
        started_at: quizStartTime, 
        completed_at: new Date().toISOString(), // Use current timestamp
      };

      console.log(exerciseData);
      
      // make API call to insert record
      try {
        await insertExerciseHistory(exerciseData);
        //alert('Quiz results saved successfully!');

      } catch (err) {
        alert('Failed to save exercise completion history. Please try again.');
      }         
    
    //navigate to the Quiz review screen
    setQuizState("end");    
};
   
const loadDashboard = () => {
    navigate("/dashboard");
};

//play audio when button is clicked
  const audioRef = useRef(null);

  
      
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 col-md-8 mx-auto'>
           
        {errorMessage && (
            <div className='container text-center mt-5'>
            <p className='alert alert-danger'>
                {errorMessage}
            </p>
            <button className='btn btn-primary' onClick={loadDashboard}>Go to Dashboard</button>
            </div>)}

        {!errorMessage && <TimerComponent isTimerOn={isTimerOn} timeLeft={timeLeft} />}
        
        {groupedQuestions.length > 0 ? (
            <>
                {/* Question text */}
                <div className='QuestionArea'>                    
                    <p>[Q {currQuestion+1}/{totalQuestions}] {groupedQuestions[currQuestion].question}</p>
                </div>

                {/* Question Image Area, if any */}
                {groupedQuestions[currQuestion].media_path && (
                <div className="ImageArea">
                    <img 
                      src={groupedQuestions[currQuestion].media_path} 
                      alt="Question related" 
                      style={{ maxWidth: '100%', height: 'auto' }} 
                   />                
                </div>)}

                {/* Render options */}
                <div className='QuesOptions'>
                {groupedQuestions[currQuestion].options.map((option, optionindex) => (

                        <Button
                            key={option.option_id}
                            onClick={() => handleOptionClick(option.option_id, option.is_correct)}
                            variant='contained'
                            size='large'
                            //color={optionChosen === option.option_id && isOptionCorrect ? "success" : "primary"} // Change color dynamically
                            color={
                                optionChosen === option.option_id && isOptionCorrect
                                  ? "success"
                                  : optionChosen === option.option_id
                                  ? "error"
                                  : "primary"
                              }
                            disabled={optionChosen !== null} // Disable all buttons after a selection
                            sx={{
                                //increase button size
                                
                                // Retain color when disabled
                                "&.Mui-disabled": {
                                  backgroundColor:
                                  optionChosen === option.option_id && isOptionCorrect
                                      ? "success.main"
                                      : optionChosen === option.option_id
                                      ? "error.main"
                                      : "primary.main",
                                  color: "white",
                                  cursor: "default", // Prevent cursor from changing when disabled                                                             
                                },
                                // Ensure cursor is a pointer only when enabled
                                "&:hover": {
                                    cursor: optionChosen === null ? "pointer" : "default",
                                },
                                textTransform: 'none',
                              }}
                            style={{ margin: "10px", padding:'20px 20px' }}
                        >
                           {optionindex+1}. {option.option_text}
                        </Button>
                        
                    ))}
                    <audio ref={audioRef} src="/click.mp3" />
                </div>
                
                {/* Next or End button */}
                <div className = "NextButton">
                {currQuestion === groupedQuestions.length - 1 ? (
                    <Button 
                        variant="contained" 
                        onClick={loadQuizReviewScreen}
                        disabled={optionChosen== null}
                        sx={{
                            backgroundColor: "#8B5DFF", // Custom purple color
                            color: "#fff", // White text
                            "&:hover": {
                              backgroundColor: "#6A42C2", // Darker purple on hover
                            },
                          }}
                          style={{ margin: "8px", padding:'10px 20px' }}
                    >
                        End Quiz
                    </Button>
                ) : (
                    <Button 
                        variant="contained" 
                        onClick={nextQuestion}
                        disabled={optionChosen== null}
                        sx={{
                            backgroundColor: "#8B5DFF", // Custom purple color
                            color: "#fff", // White text
                            "&:hover": {
                              backgroundColor: "#6A42C2", // Darker purple on hover
                            },
                          }}
                          style={{ margin: "8px", padding:'10px 20px' }}
                    >
                        Next Question
                    </Button>
                )}
                </div>

                {/* Explanation area: display only when an option is selected and learning mode is enabled */}
                {optionChosen && isLearningMode && (                
                <div className='Explanation'>
                    <p>{groupedQuestions[currQuestion].explanation} </p>
                </div>)}
                
            </>
        ) : (
            <p></p> // Display a loading message while questions are being fetched            
        )}     
        
      </div>
      </div>
      </div>
    )
}

export default QuizEngine;