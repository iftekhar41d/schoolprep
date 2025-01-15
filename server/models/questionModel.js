import db from "../utils/db.js"

//query for fetching questions with options
const getQuestionsByUnit = async (unitid) => {
  const result = await db.query(
    `SELECT
        q.question_id,
        q.question_text as question,
        q.question_type,
        q.explanation,
        q.points,
        q.media_path,
        q.unit_id,
        q.subject_id,
		o.option_id,
		o.option_text,
		o.is_correct
    FROM questions q
	JOIN question_options o
	ON q.question_id = o.question_id
  WHERE unit_id=$1
	ORDER BY q.question_id, o.option_text`, [unitid]);

    return result.rows; //array of course units
  };
  
  //query for fetching questions without options
  const getQuestionsOnlyByUnit = async (unitid) => {
    const result = await db.query(
      `SELECT
          question_id,
          question_text as question,
          question_type,
          explanation,
          points,
          unit_id,
          subject_id
      FROM questions
      WHERE unit_id=$1`, [unitid]
      );    
      return result.rows; //array of course units
    };
  
  
  export {getQuestionsByUnit};