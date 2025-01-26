import db from "../utils/db.js"
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import authenticate from '../middlewares/authenticate.js';
import nodemailer from 'nodemailer';

const forgetPasswordRouter = express.Router();
const envVariables = dotenv.config();

// Forgot Password Endpoint
forgetPasswordRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = jwt.sign({ id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save the token and expiration time in the database
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE user_id = $3',
            [resetToken, resetPasswordExpires, user.rows[0].user_id]
        );

        console.log('Email sent!');

        // Send the reset link to the user's email
        //replace the front-end URL with production server URL
        
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.rows[0].email,
            subject: 'Mentisq - password reset',
            text: `Click the link to reset your password: ${resetUrl}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset link sent to your email' });
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

forgetPasswordRouter.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the token and check if it's not expired
        const user = await db.query(
            'SELECT * FROM users WHERE user_id = $1 AND reset_password_token = $2 AND reset_password_expires > $3',
            [decoded.id, token, new Date()]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset token
        await db.query(
            'UPDATE users SET pwd = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE user_id = $2',
            [hashedPassword, decoded.id]
        );

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default forgetPasswordRouter;