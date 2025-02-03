import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

function UserProfile() {
  const { loggedinUser, loggedinUserId, login, profileImage, updateProfileImage } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(profileImage);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/profile/${loggedinUserId}`);
        setFullName(response.data.fullName);
        setEmail(response.data.email);
        setSelectedImage(response.data.profileImage|| 'profile1.png');
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [loggedinUserId]);

  const handleImageChange = async (newImage) => {
    try {
      await api.put(`/profile/${loggedinUserId}/image`, { profileImage: newImage });
      // Update the profile image in the context
      updateProfileImage(newImage);
      
      //update local state
      setSelectedImage(newImage);
      setShowImageSelector(false);
    } catch (error) {
      console.error('Failed to update profile image:', error);
    }
  };

  const handleCancelImageChange = () => {
    setShowImageSelector(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert('Password cannot be blank');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await api.put(`/profile/${loggedinUserId}/password`, { newPassword });
      setIsPasswordChanging(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  return (
    <div className='container userProfileArea'>
      <div>
        {/* Header */}
        
          <h2 className='text-center mt-5 custom-page-title'>{fullName}'s Profile</h2>
        

        {/* Profile Pic */}
        <div className='profile-pic-container'>
          <img
            src={`/profile/${selectedImage}`}
            alt="Profile"
            className='profile-img'
          />
          <div 
            onClick={() => setShowImageSelector(true)}
            className="click-to-change"
          >
            Click to change
          </div>
        </div>

        {/* Image Selector Popup */}
        {showImageSelector && (
          <div className='image-selector'>
            <img
              src={`/profile/profile1.png`}
              alt="Profile 1"
              onClick={() => handleImageChange('profile1.png')}
              className='profile-img-selector'
            />
            <img
              src={`/profile/profile2.png`}
              alt="Profile 2"
              onClick={() => handleImageChange('profile2.png')}
              className='profile-img-selector'
            />
            <img
              src={`/profile/profile3.png`}
              alt="Profile 3"
              onClick={() => handleImageChange('profile3.png')}
              className='profile-img-selector'
            />
            <img
              src={`/profile/profile4.png`}
              alt="Rishi Profile"
              onClick={() => handleImageChange('profile4.png')}
              className='profile-img-selector'
            />
            <img
              src={`/profile/profile5.png`}
              alt="Aadi Profile"
              onClick={() => handleImageChange('profile5.png')}
              className='profile-img-selector'
            />
            <button className='btn btn-light' onClick={handleCancelImageChange} style={{ marginLeft: "10px", marginTop: "5px", marginBottom: "5px" }}>
              Cancel
            </button>
          </div>
        )}

        {/* User Info Form */}
        <form className='user-info-form'>
          <div className='form-group'>
            <label htmlFor='fullName'>Full Name:</label>
            <input
              type='text'
              id='fullName'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='form-control'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              readOnly
              className='form-control'
            />
          </div>

          {isPasswordChanging && (
            <>
            <div className='form-group'>
              <label htmlFor='newPassword'>New Password:</label>
              <input
                type='password'
                id='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='form-control'
              />
              </div>
              <div>
              <label htmlFor='confirmPassword'>Confirm Password:</label>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='form-control'
              />
            </div>
            </>
          )}

          <div className='form-group' style={{marginTop: "30px"}}>
            <button
              type='button'
              onClick={isPasswordChanging ? handleChangePassword : () => setIsPasswordChanging(true)}
              className='btn btn-primary'
            >
              {isPasswordChanging ? 'Save New Password' : 'Change Password'}
            </button>
            
            {isPasswordChanging && 
            <button
              type='button'
              onClick={() => setIsPasswordChanging(false)}
              className='btn btn-secondary cancel-btn'
            >
              Cancel Change
            </button>}


          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;