import { getAllCourseUnits } from "../models/courseUnitsModel.js";
import express from 'express';
import authenticate from '../middlewares/authenticate.js'

const chaptersRouter = express.Router();

//get all course units from DB
chaptersRouter.get('/', authenticate, async (req, res) => {
    const userId = req.query.user_id;

    try{
        const unitsList = await getAllCourseUnits(userId);
        //console.log('this is from controller');
        //console.log(unitsList);
        res.json(unitsList);
    }catch(err){
        //console.log('oops! something wrong with the database');
        console.error(err);
        res.status(500).json({message: 'Server Error'});
    }

});

export default chaptersRouter;