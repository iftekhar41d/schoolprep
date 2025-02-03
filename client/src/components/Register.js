import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/users/`,
});

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    
    //actions upon form submit
    const handleSubmit = async(e)=>{
        e.preventDefault();

        try{
            //make api call to register user info
            //console.log(fullName);
            const response = await api.post('/register', {email,password,fullName});

            //if registration is successful
            setErrorMessage("");
            alert('Registration successful!');
            navigate('/login'); //upon successful registration, redirected to the login page

        }catch(error){
            //alert('Registration failed. Please try again');
                // Handle error response
            if (error.response && error.response.data) {
                // Server responded with a status other than 2xx
                setErrorMessage(error.response.data.message);
            } else {
                // Network or other unexpected errors
                setErrorMessage('Something went wrong. Please try again.');
            }
        }
        
    }

    const handleFullNameChange = (e)=>{
        setFullName(e.target.value);
    };

    const handleEmailChange = (e)=>{
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e)=>{
        setPassword(e.target.value);
    };

  return (    
        <div className="container custom-margin">
        <div className="row justify-content-center ">
        <div className="col-md-6 col-lg-4 ">
            <div className="card shadow">
            <div className="card-body auth-form">
                <h3 className="text-center mb-4">Register</h3>
                <form  onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" value={fullName} onChange={handleFullNameChange} className="form-control" name="fullName" placeholder="Enter your full name" required/>
                    </div>    

                    <div className="mb-3">
                        <input type="email" value={email} onChange={handleEmailChange} className="form-control" name="email" placeholder="Enter your email" required/>
                    </div>
                    
                    <div className="mb-3">
                        <input type="password" value={password} onChange={handlePasswordChange} className="form-control" name="password" placeholder="Enter your password" required/>
                    </div>          
                
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Submit</button>                 

                    </div>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  
            </div>
            </div>
        </div>
        </div>
        </div>  
  )
}

export default Register;