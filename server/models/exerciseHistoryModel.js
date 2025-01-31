import db from "../utils/db.js"

const insertOrUpdateExerciseHistory = async ({
    user_id,
    unit_id,
    is_completed,
    total_score,
    total_questions,
    correct_answers,
    completion_time,
    started_at,
    completed_at
}) => {
  const query = `
        INSERT INTO exercise_history 
        (user_id, unit_id, is_completed, total_score, total_questions, correct_answers, completion_time, started_at, completed_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (user_id, unit_id) 
        DO UPDATE SET 
        is_completed = EXCLUDED.is_completed,
        total_score = EXCLUDED.total_score,
        total_questions = EXCLUDED.total_questions,
        correct_answers = EXCLUDED.correct_answers,
        completion_time = EXCLUDED.completion_time,
        started_at = EXCLUDED.started_at,
        completed_at = EXCLUDED.completed_at
        RETURNING *;` ;
    
    const values = [
        user_id,
        unit_id,
        is_completed,
        total_score,
        total_questions,
        correct_answers,
        completion_time,
        started_at,
        completed_at
    ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];  // Return the first row of the result
  } catch (err) {
    console.error('Error inserting/updating exercise history:', err);
    throw new Error('Database error');
  }
  };  

  const insertQuestionReport = async ({
    user_id,
    question_id,
    is_reported,
    updated_at
}) => {
  const query = `
        INSERT INTO question_report 
        (user_id, question_id, is_reported, updated_at) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, question_id) 
        DO UPDATE SET 
        is_reported = EXCLUDED.is_reported,
        updated_at = EXCLUDED.updated_at
        RETURNING *;` ;
    
    const values = [
        user_id,
        question_id,
        is_reported,
        updated_at
    ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];  // Return the first row of the result
  } catch (err) {
    console.error('Error inserting/updating question report:', err);
    throw new Error('Database error');
  }
  };  
  
  export {insertOrUpdateExerciseHistory, insertQuestionReport};