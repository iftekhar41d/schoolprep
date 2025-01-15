import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ProgressBar from './Progressbar';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/chapters/`,
});


function CourseListing() {
    const navigate = useNavigate();
    const [groupedChapters, setGroupedChapters] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const { loggedinUserId } = useContext(AuthContext); //get currently loggedin userID
    
    //this code block to retrieve token is taken outside of axios.create for testing
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    //fetch units/chapters data from backend when component is mounted
    useEffect(()=>{        
        
        //define async function for fetching all units data
        const fetchUnits = async () =>{
            if (!loggedinUserId) return;

            //if bearer token not found
            if (!token) {
              console.error('No token found');
              return;
            }

          //if token found, make the api call

            try{
                //make API call
                const response = await api.get('/', {
                  headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the header
                },
                  params: { 
                    user_id: loggedinUserId, 
                  },
                });
                //const response = await axios.get('http://localhost:5000/api/chapters');            
                               
                //group units/chapters data
                const groupedData = response.data.reduce((acc, curr) => {
                    const { subjectid, subject, unitid, unit, is_completed, total_questions, correct_answers, lesson_completed} = curr;
                    
                    //check if entry for subjectid already exists in accumulator
                    if (!acc[subjectid]) {
                        acc[subjectid] = { subjectid, subject, units: [] };
                    }
                
                    acc[subjectid].units.push({ unitid, unit, is_completed, total_questions, correct_answers, lesson_completed });                
                    return acc;
                }, {});

                setGroupedChapters(Object.values(groupedData)); // Convert to array
            }catch(err){
                console.error(err);
                setErrorMessage('Failed to fetch units data');
            }

        };

        fetchUnits();        
    },[loggedinUserId]); //ensure that the data is fetched only once when the component is mounted or when loggedinUserId changes

    //console.log(groupedChapters);

    if (errorMessage){
        return <div>{errorMessage}</div>;
    }

    function loadQuiz(subject, unitid, unit){
        //alert(`you clicked on Quiz! for Subject ${subject}: Unit ${unitid}`);
        //console.log(`subject: ${subject} unit ${unit}`);
        navigate(`/quiz/${unitid}`, { state: { subject, unit } });  //pass subject and unit name as additional data without including in URL 
    }

    function loadLearningBoard(subject, unitid, unit){
      navigate(`/learningboard/${unitid}`, { state: { subject, unit } }); 
    }

  return (
    <div className="container mt-5">
      <div>
        {groupedChapters.map(({ subjectid, subject, units }) => (
          <div key={subjectid} className="mb-4">
            <div className='subject-header subheader-container'>
                    <img
                      className='sub-image' 
                      src='./circle-design.png' 
                      alt="subject logo"                       
                   />    
                <h5 className="sub-header">{subject}</h5>
            </div>
            <table className="table table-striped table-bordered mb-5">
              <tbody>
                {units.map(({ unitid, unit, is_completed, total_questions, correct_answers, lesson_completed }, unitindex) => (
                  <tr key={unitid}>
                    <td className="col-5">{unitindex+1}. {unit} </td>
                    <td className="col-3">
                      <div className="d-flex gap-4">
                        <button 
                        className="btn btn-outline-info btn me-2"
                        onClick={() => loadLearningBoard(subject, unitid, unit)}
                        >
                            Learn
                        </button>
                        <div>
                            {lesson_completed && <span className='unit-tick'>✅</span>}
                        </div>                          
                      </div>
                    </td>
                    <td className="col-4">
                      <div className="d-flex gap-4">
                         <button
                          className="btn btn-primary btn me-2"
                          onClick={() => loadQuiz(subject, unitid, unit)}
                        >
                          Exercise
                        </button>
                        <div>
                            {is_completed && <span className='unit-tick'>✅</span>}
                        </div>
                        <div>                       
                            {/* {is_completed && <ProgressBar progress={50} /> } */}                             
                            {is_completed && <p className='unit-accuracy'> 
                              <img 
                                src="bullseye-bg.png" 
                                alt="Icon" 
                                width="23" 
                                height="20"
                                style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                {Math.round(correct_answers*100/total_questions)}% </p>}
                        </div>  
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseListing;