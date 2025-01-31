import { insertOrUpdateExerciseHistory, insertQuestionReport } from '../models/exerciseHistoryModel.js';
import express from 'express';
import pool from "../utils/db.js"

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

//insert question report records
exerciseHistoryRouter.post('/report-question', async (req, res) => {
  const {
      user_id,
      question_id,
      is_reported,
      updated_at,
    } = req.body;

  try{
       // Call the function from model to insert or update the record
  const result = await insertQuestionReport({
      user_id,
      question_id,
      is_reported,
      updated_at,
    });

    // Send the result back as response
    res.status(200).json({ message: 'Question report inserted successfully', result });   

  }catch(err){
      res.status(500).json({ error: 'Failed to insert question report' });
  }

});

//get report question status
exerciseHistoryRouter.post('/questionreportstatus', async (req, res) => {
  const {
    user_id,
    question_id,
  } = req.body;

  const query = `
    SELECT COALESCE(is_reported, FALSE) as is_reported
    FROM question_report
    WHERE user_id = $1
    AND question_id = $2
  `
const query_values = [user_id, question_id];

  try {
    // Insert the new lesson into the 'lessons' table
    const result = await pool.query(query, query_values );
    
      //console.log(result.rows);
      res.status(200).json(result.rows[0]);    
  } catch (error) {
      res.status(500).json({ error: 'Error fetching question report status' });
  }
});

export default exerciseHistoryRouter;