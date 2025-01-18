import express from "express";
import cors from "cors";
import pool from "./utils/db.js"
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';

//import routes
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import courseUnitsRoutes from './routes/courseUnitsRoutes.js';
import chaptersRouter from "./controllers/courseUnitsController.js";
import questionsRouter from "./controllers/questionController.js";
import exerciseHistoryRouter from "./controllers/exerciseHistoryController.js";
import subjectRouter from "./controllers/subjectController.js";
import unitsRouter from "./controllers/unitsController.js";
import classLevelRouter from "./controllers/classLevelsController.js";
import router from "./controllers/manageQuestionsController.js";
import lessonsRouter from "./controllers/manageLessonsController.js";

const envVariables = dotenv.config(); //for accessing environment variables
const app = express(); 
const PORT = process.env.NODE_PORT||5000

//rate limiter
const limiter = rateLimit({
    windowMs: process.env.RATE_WINDOW, // 15 minutes
    max: process.env.MAX_CALL, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

//CORS configuration to restrict API request from client domain only
const corsOptions = {
    origin: process.env.CLIENT_DOMAIN,
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
};

//middleware
//app.use(cors(corsOptions)); //allow only front-end app domain
app.use(cors()); //allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

//mount routes
app.use('/api/users', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/chapters', chaptersRouter);
app.use('/api/questions', questionsRouter);
app.use('/api', exerciseHistoryRouter);
app.use('/', subjectRouter);
app.use('/', unitsRouter);
app.use('/api', classLevelRouter);
app.use('/api',router);
app.use('/api', lessonsRouter);

//start server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
