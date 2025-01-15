import React, {useState, useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/users/`,
  headers: {
    'Content-Type': 'application/json'
  }
  });

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      // Prepare login data with trimmed values
      const loginData = {
        email: email.trim(),
        password: password // Ensure password is string
      };

      //make API call
      const response = await api.post('/login', loginData);
      console.log(response);
      if (response.data.token){
          localStorage.setItem('token', response.data.token); //store jwt token
          //console.log('Token saved successfully');
          //console.log(response.data.token);
      }else{
        console.error('No token received in response');
      }
      //console.log(response.data.user.email);
      //console.log(response.data.user.id);      
      setErrorMessage('');
      login(response.data.user.email, response.data.user.id);//update context
      /*implement separate code for setting admin/user flag */
      navigate('/dashboard'); //go to dashboard

    }catch(error){
      //alert('Login failed. Please try again');
      console.log(error.response);
      setErrorMessage(error.response.data.message);
    }   

  }

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
            <h3 className="text-center mb-4">Login</h3>
            <form  onSubmit={handleSubmit}>     
              <div className="mb-3">
                <input type="email" value={email} onChange={handleEmailChange} className="form-control" name="email" placeholder="Enter your email" required/>
              </div>
              
              <div className="mb-3">
                <input type="password" value={password} onChange={handlePasswordChange} className="form-control" name="password" placeholder="Enter your password" required/>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <a href="#" className="text-decoration-none">Forgot Password?</a>
              </div>
            
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Login</button>                 

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

export default Login;
