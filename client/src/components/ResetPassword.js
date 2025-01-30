import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  });

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/reset-password/${token}`, { newPassword });
            setMessage(response.data.message);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error resetting password');
            setMessage('');
        }
    };

    return (
        <div className="container custom-margin">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow">
                <div className="card-body auth-form">
                  <h3 className="text-center mb-4">Reset Password</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
    
                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary">
                        Reset Password
                      </button>
                    </div>
                  </form>
    
                  {message && <p style={{ color: 'green' }}>{message}</p>}
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};

export default ResetPassword;