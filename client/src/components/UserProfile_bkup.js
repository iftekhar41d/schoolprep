import React, { useState } from 'react';

function UserProfile() {
  const [selectedImage, setSelectedImage] = useState('profile1.png');
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [fullName, setFullName] = useState("Rishita");
  const [email, setEmail] = useState('rishita@example.com');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

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

  return (
    <div className='container'>
      <div>
        {/* Header */}
        <div className=''>
          <h2 className='text-center mt-5 custom-page-title'>{fullName}'s Profile</h2>
        </div>

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
            <button className='btn btn-light' onClick={handleCancelImageChange}>
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
