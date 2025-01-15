import { insertOrUpdateExerciseHistory } from '../models/exerciseHistoryModel.js';
import express from 'express';

const exerciseHistoryRouter = express.Router();

//get all course units from DB
exerciseHistoryRouter.post('/end-exercise', async (req, res) => {
    const {
        user_id,
        unit_id,
        is_completed,
        total_score,
        total_questions,
        correct_answers,
        completion_time,
        started_at,
        completed_at,
      } = req.body;

    try{
         // Call the function from model to insert or update the record
    const result = await insertOrUpdateExerciseHistory({
        user_id,
        unit_id,
        is_completed,
        total_score,
        total_questions,
        correct_answers,
        completion_time,
        started_at,
        completed_at,
      });
  
      // Send the result back as response
      res.status(200).json({ message: 'Exercise history inserted/updated successfully', result });   

    }catch(err){
        res.status(500).json({ error: 'Failed to update exercise history' });
    }

});

export default exerciseHistoryRouter;