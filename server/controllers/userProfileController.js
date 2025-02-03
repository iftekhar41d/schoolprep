import express from 'express';
import db from "../utils/db.js"; 
import bcrypt from 'bcrypt';
import authenticate from '../middlewares/authenticate.js';

const userProfileRouter = express.Router();

// Fetch user profile data
userProfileRouter.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Query the database to fetch user profile data
      const result = await db.query('SELECT fullname, email, profile_image FROM users WHERE user_id = $1', [userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userProfile = result.rows[0];
      res.status(200).json({
        fullName: userProfile.fullname,
        email: userProfile.email,
        profileImage: userProfile.profile_image,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

// Update profile image
userProfileRouter.put('/profile/:userId/image', async (req, res) => {
  const { userId } = req.params;
  const { profileImage } = req.body;

  try {
    await db.query('UPDATE users SET profile_image = $1 WHERE user_id = $2', [profileImage, userId]);
    res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (error) {
    console.error('Failed to update profile image:', error);
    res.status(500).json({ message: 'Failed to update profile image' });
  }
});

// Update full name
userProfileRouter.put('/profile/:userId/name', async (req, res) => {
  const { userId } = req.params;
  const { fullName } = req.body;

  try {
    await db.query('UPDATE users SET full_name = $1 WHERE user_id = $2', [fullName, userId]);
    res.status(200).json({ message: 'Full name updated successfully' });
  } catch (error) {
    console.error('Failed to update full name:', error);
    res.status(500).json({ message: 'Failed to update full name' });
  }
});

// Update password
userProfileRouter.put('/profile/:userId/password', async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET pwd = $1 WHERE user_id = $2', [hashedPassword, userId]);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update password:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

export default userProfileRouter;