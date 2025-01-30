import React, { useState, useEffect, useContext } from 'react';
import {useParams, useLocation} from 'react-router-dom';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,

});

function LearningBoard() {
    const location = useLocation();
    const { subject, unit } = location.state || {}; // Destructure values from state 
    const { unitid } = useParams(); //get unit id from URL
    const [lessonContent, setLessonContent] = useState(''); // To hold the lesson content
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [isLessonCompleted, setIsLessonCompleted] = useState(false);
    const { loggedinUserId } = useContext(AuthContext); //get currently loggedin userID  
    
    const lessonHistoryParams = {
                              user_id: loggedinUserId, 
                              unit_id: unitid,
                            }
    
    useEffect(() => {
      // Make the API call when the component mounts or when the unitid changes
      const fetchLessonContent = async () => {
        try {
          const response = await api.get(`/lessons/${unitid}`);
          //console.log("API Response:", response);

            // Check if the response contains content
          if (response?.data?.lesson_content) {
            setLessonContent(response.data.lesson_content);
            
          } else {
            setError('Content not found.');
          }
          
        } catch (error) {
          setError('Error fetching lesson content');
          console.error("Error fetching lesson content:", error);
        } finally {
          setLoading(false); // Set loading to false when the request is complete
        }
      };
  
      fetchLessonContent();
    }, [unitid]); // This hook runs when the unitid prop changes
    
    //check lesson completion status

    useEffect(() => {
      // Define an async function to fetch data
      const fetchLessonStatus = async () => {
        try {
          //modified api call from axios
          const response = await api.post(`/lessonstatus`, lessonHistoryParams);
          //console.log(response.data);
          const { is_completed } = response.data; // Destructure 'is_completed' from API response
          if (is_completed) {
            //console.log(`is lesson completed? ${is_completed}`);
            setIsLessonCompleted(true); // Update state if is_completed is true
          }
        } catch (error) {
          console.error('Error fetching lesson status:', error);
        }
      };
  
      fetchLessonStatus(); // Call the async function inside useEffect
    }, [lessonHistoryParams]); // Dependency array ensures this runs when lessonData changes    


    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    
      // Configure DOMPurify to allow iframes and YouTube embedding
    const sanitizerConfig = {
    ADD_TAGS: ['iframe'], // Allow iframe
    ADD_ATTR: [
      'allow', 
      'allowfullscreen', 
      'frameborder', 
      'width', 
      'height', 
      'src', 
      'title'
    ], // Allow necessary iframe attributes
  };

    const sanitizedContent = DOMPurify.sanitize(lessonContent, sanitizerConfig);
  
  //handle button click
  const handleMarkComplete = async () =>{
    setIsLessonCompleted(true);

    //make an API call to update database
    //create exercise data object
    const lessonData = {
      user_id: loggedinUserId, // currently logged in userID
      unit_id: unitid,
      is_completed: true,
      completed_at: new Date().toISOString(), // Use current timestamp
    };

    //console.log(lessonData);
    
        // make API call to insert record
        try {
          const response = await api.post(`/end-lesson`, lessonData); // Replace with your API URL
          if (response.data){
            console.log(`response from client component: ${response.data}`);
          }
          return response.data;

        } catch (err) {
          console.error('Error inserting exercise history:', err);
          throw err;
        } 
    }

  return (
    <div> 
        <div className='lesson-header'>    
          <h2 className="text-center mt-5 custom-page-title">{subject}: {unit}</h2>          
        </div>   
      {/* Render the HTML content */}
      <div className='container lesson-area'>
          <div className='button-container'>
             {!isLessonCompleted ? (
                <button className='btn btn-secondary' onClick={handleMarkComplete}>               
                  Mark complete
                </button>): 
              (
                  <button className='btn btn-secondary' disabled>               
                    Completed
                  </button>)
              }
          </div>

          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  );
}

export default LearningBoard;