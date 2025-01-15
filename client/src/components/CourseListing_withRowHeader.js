import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/chapters/`,
});


function CourseListing() {
    const navigate = useNavigate();
    const [groupedChapters, setGroupedChapters] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    //fetch units/chapters data from backend when component is mounted
    useEffect(()=>{
        //define async function for fetching all units data
        const fetchUnits = async () =>{
            try{
                //make API call
                const response = await api.get('/');
                //const response = await axios.get('http://localhost:5000/api/chapters');            
                               
                //group units/chapters data
                const groupedData = response.data.reduce((acc, curr) => {
                    const { subjectid, subject, unitid, unit } = curr;
                    
                    //check if entry for subjectid already exists in accumulator
                    if (!acc[subjectid]) {
                        acc[subjectid] = { subjectid, subject, units: [] };
                    }
                
                    acc[subjectid].units.push({ unitid, unit });                
                    return acc;
                }, {});

                setGroupedChapters(Object.values(groupedData)); // Convert to array
            }catch(err){
                console.error(err);
                setErrorMessage('Failed to fetch units data');
            }

        };

        fetchUnits();        
    },[]); //ensure that the data is fetched only once when the component is mounted

    if (errorMessage){
        return <div>{errorMessage}</div>;
    }

    function loadQuiz(subject, unitid, unit){
        //alert(`you clicked on Quiz! for Subject ${subject}: Unit ${unitid}`);
        //console.log(`subject: ${subject} unit ${unit}`);
        navigate(`/quiz/${unitid}`, { state: { subject, unit } });  //pass subject and unit name as additional data without including in URL 
    }

  return (
    <div className="container-fluid mt-5">
      <div>
        {groupedChapters.map(({ subjectid, subject, units }) => (
          <div key={subjectid} className="mb-4">
            <div className='subject-header'>
                <h4 className="mb-3">{subject}</h4>
            </div>
            <table className="table table-striped table-bordered">
              <thead className='course-th'>
                <tr>
                  <th className="col-6">Course Unit</th> {/* 50% width for "Unit" column */}
                  <th className="col-3">Learn</th> {/* 33% width for "Actions" column */}
                  <th className="col-3">Exercise</th> {/* 17% width for "Actions" column */}
                </tr>
              </thead>
              <tbody>
                {units.map(({ unitid, unit }, unitindex) => (
                  <tr key={unitid}>
                    <td>{unitindex+1}. {unit}</td>
                    <td>
                      <div className="d-flex gap-4">
                        <button className="btn btn-outline-info btn me-2">
                            Learn</button>
                        <button className="btn btn-secondary btn me-2">
                            Status
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-4">
                         <button
                          className="btn btn-primary btn me-2"
                          onClick={() => loadQuiz(subject, unitid, unit)}
                        >
                          Exercise
                        </button>
                        <button className="btn btn-secondary btn me-2">
                            Status
                        </button>
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