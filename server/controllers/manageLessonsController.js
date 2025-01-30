import express from 'express';
import pool from "../utils/db.js"
import authenticate from '../middlewares/authenticate.js';

const lessonsRouter = express.Router();

// Create new lesson to the database
lessonsRouter.post('/lessons', async (req, res) => {
  const { unit_id, content } = req.body;
  const lesson_title = 'lesson title'

  try {
    // Insert the new lesson into the 'lessons' table
    const result = await pool.query(
      'INSERT INTO lessons (unit_id, lesson_title, lesson_content) VALUES ($1, $2, $3) RETURNING lesson_id',
      [unit_id, lesson_title, content]
    );
    
    // Send the lesson_id back to the frontend
    const lesson_id = result.rows[0].lesson_id;
    res.status(200).json({ lesson_id, unit_id, content });
  } catch (error) {
    console.error('Error saving lesson:', error);
    res.status(500).json({ error: 'Error saving lesson' });
  }
});

//update existing new lesson to the database
lessonsRouter.put('/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { unit_id, content } = req.body;
  const lesson_title = 'lesson title'

  //console.log(`lesson title ${lesson_title} lesson content ${content} and unit id ${id}`);

  try {
    // Insert the new lesson into the 'lessons' table
    const result = await pool.query(
      'UPDATE lessons SET lesson_title = $1, lesson_content = $2 WHERE unit_id = $3 RETURNING *',[lesson_title, content, id]
    );
    
    // Send the unit_id back to the frontend
    const lesson_id = result.rows[0].lesson_id;
    //console.log(result.rows[0]);
    res.status(200).json({ lesson_id, unit_id, content });
  } catch (error) {
    console.error('Error saving lesson:', error);
    res.status(500).json({ error: 'Error saving lesson' });
  }
});


//get lesson content

lessonsRouter.get('/lessons/:unitid', async (req, res) => {
  const { unitid } = req.params;
  
  try {
    // fetch the lessons by unit_id
    //console.log(`lesson for requested unit id ${unitid}`);
    const result = await pool.query('SELECT lesson_content FROM lessons WHERE unit_id = $1 LIMIT 1', [unitid]);

    if (result.rows.length === 0) {
      // No records found
      //console.log("No lessons found for this unit.");
      return res.status(200).json({ lesson_content: "" });      
      } else {
      // Records found
      //console.log("Lessons found:", result.rows[0]);
      return res.status(200).json(result.rows[0]);    
    }

  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Error saving lesson' });
  }
});

// Create new lesson history

lessonsRouter.post('/end-lesson', async (req, res) => {
  const {
    user_id,
    unit_id,
    is_completed,
    completed_at,
  } = req.body;

  const query = `
  INSERT INTO lesson_history 
  (user_id, unit_id, is_completed, completed_at) 
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (user_id, unit_id) 
  DO UPDATE SET 
  is_completed = EXCLUDED.is_completed,
  completed_at = EXCLUDED.completed_at
  RETURNING *;` ;

const query_values = [user_id, unit_id, is_completed, completed_at];

  try {
    // Insert the new lesson into the 'lessons' table
    const result = await pool.query(
      query, query_values );
    
    // Send the lesson_id back to the frontend
    const lesson_id = result.rows[0].lesson_id;
    res.status(200).json({ message: "Lesson history created successfully", lesson_id});
  } catch (error) {
    console.error('Error saving lesson:', error);
    res.status(500).json({ error: 'Error saving lesson' });
  }
});

//get lesson completion status
lessonsRouter.post('/lessonstatus', async (req, res) => {
  const {
    user_id,
    unit_id,
  } = req.body;

  const query = `
    SELECT *
    FROM lesson_history
    WHERE user_id = $1
    AND unit_id = $2
  `
const query_values = [user_id, unit_id];

  try {
    // Insert the new lesson into the 'lessons' table
    const result = await pool.query(query, query_values );
    
      //console.log(result.rows);
      res.status(200).json(result.rows[0]);    
  } catch (error) {
    console.error('Error saving lesson:', error);
    res.status(500).json({ error: 'Error fetching lesson history' });
  }
});


export default lessonsRouter;
