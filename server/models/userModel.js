import db from "../utils/db.js"
import bcrypt from 'bcrypt'

const createUser = async (email, password, fullName) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
      'INSERT INTO users (email, pwd, fullname) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, fullName]
    );
    return result.rows[0];
  };
  
  const getUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  };

  const getUserStatus = async (email) =>{
    const result = await db.query('SELECT is_active FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
  
  export { createUser, getUserByEmail, getUserStatus };