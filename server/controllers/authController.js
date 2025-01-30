//logic to handle user login and registration

import {createUser, getUserByEmail, getUserStatus} from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import Joi from "joi";

const envVariables = dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Validation schema
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required() 
});

// Register a new user
export const register = async (req, res) => {
  
  //validate using joi validation schema before sending to DB
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  
  //continue with registration logic
  const { email, password} = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    //if this is a new user email
    const user = await createUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email); //get user from database
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //If user is found, check if user is active, i.e. admin has authorized or payment is successful
    const {is_active} = await getUserStatus(email);
    //console.log(`user activation status: ${is_active}`);
    if (!is_active){
      return res.status(403).json({ message: 'User not active; please contact support!' });
    }
    
    //If it's an active user, check the password
    const isPasswordValid = await bcrypt.compare(password, user.pwd); //match password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //if credentials are valid, provide a jwt token to client
    const token = jwt.sign({ id: user.user_id}, JWT_SECRET, {expiresIn: '1h'});
    
    //when login is successful, send the token and user object in response to client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
