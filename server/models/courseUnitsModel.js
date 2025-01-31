import db from "../utils/db.js"

const getAllCourseUnits = async (userid) => {
  const result = await db.query(
    `SELECT 
      s.subject_id as subjectid, 
      s.subject_name as subject,
      u.unit_id as unitid,
      u.unit_name as unit,
	    COALESCE(eh.is_completed, FALSE) AS is_completed,
      COALESCE(eh.total_questions, 0) as total_questions,
      COALESCE(eh.correct_answers,0) as correct_answers,
      COALESCE(lh.is_completed, FALSE) AS lesson_completed
    FROM subjects s
    JOIN units u on s.subject_id = u.subject_id
	  LEFT JOIN exercise_history eh ON u.unit_id = eh.unit_id AND eh.user_id = $1
    LEFT JOIN lesson_history lh on u.unit_id = lh.unit_id AND lh.user_id = $2
	  ORDER BY subjectid, unitid`,[userid, userid]);
        
    return result.rows; //array of course units
  };
  
  
  export {getAllCourseUnits};