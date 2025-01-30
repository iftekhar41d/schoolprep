import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const envVariables = dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate routes
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log(`auth header: ${authHeader}`);
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied' });
    }
    //console.log(`authorization header ${authHeader}`);
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request object
        //console.log(`verified req.user ${req.user}`);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticate;
