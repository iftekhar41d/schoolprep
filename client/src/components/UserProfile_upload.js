import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  });

function UserProfile() {
  const [selectedImage, setSelectedImage] = useState('/profile/profile1.png');
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [fullName, setFullName] = useState("Rishita");
  const [email, setEmail] = useState('rishita@example.com');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageChange = (newImage) => {
    setSelectedImage(newImage);
    setShowImageSelector(false);
  };

  const handleCancelImageChange = () => {
    setShowImageSelector(false);
  };

  const handleChangePassword = () => {
    setIsPasswordChanging(!isPasswordChanging);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await api.post('/profileimage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFilePath = `/user_upload/${response.data.filename}`;
      setUploadedImage(uploadedFilePath);
      setSelectedImage(uploadedFilePath);
      setShowImageSelector(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className='container userProfileArea'>
      <div>
        {/* Header */}
        <div className='subject-header subheader-container'>
          <h3 className='sub-header'>{fullName}'s Profile</h3>
        </div>

        {/* Profile Pic */}
        <div className='profile-pic-container'>
          <img
            src={selectedImage}
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
              src='/profile/profile1.png'
              alt="Profile 1"
              onClick={() => handleImageChange('/profile/profile1.png')}
              className='profile-img-selector'
            />
            <img
              src='/profile/profile2.png'
              alt="Profile 2"
              onClick={() => handleImageChange('/profile/profile2.png')}
              className='profile-img-selector'
            />
            <img
              src='/profile/profile3.png'
              alt="Profile 3"
              onClick={() => handleImageChange('/profile/profile3.png')}
              className='profile-img-selector'
            />
            <div className='upload-section'>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <button onClick={handleCancelImageChange}>Cancel</button>
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
              className='form-input'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-input'
            />
          </div>

          <div className='form-group'>
            <button
              type='button'
              onClick={handleChangePassword}
              className='change-password-btn'
            >
              {isPasswordChanging ? 'Cancel Change Password' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
