import { getQuestionsByUnit } from '../models/questionModel.js';
import express from 'express';
import authenticate from '../middlewares/authenticate.js';

const questionsRouter = express.Router();

//get questions by unit/chapter
questionsRouter.get('/:unitid', authenticate, async (req, res) => {
    const { unitid } = req.params;

    try{
        const questionList = await getQuestionsByUnit(unitid);
        
        if (questionList.length ===0){
            return res.status(404).json({message: 'No questions found for this unit'});
        }

        //console.log(questionList);
        res.json(questionList);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to fetch questions from the server'});
    }

});

export default questionsRouter;