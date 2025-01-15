import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import pool from "../utils/db.js"
import path from 'path';
import { fileURLToPath } from "url";
import authenticate from '../middlewares/authenticate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
//const pool = new pool(); // Configure your PostgreSQL connection

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer
const upload = multer({
    dest: uploadsDir,
  });

router.get("/subjects", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM subjects");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/subjectunits", async (req, res) => {
  const { subject_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM units WHERE subject_id = $1",
      [subject_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//File upload route
router.post("/ques/upload", upload.single("csv_file"), async (req, res) => {
    const { subject_id, unit_id } = req.body;
  
    // Validate input
    if (!subject_id || !unit_id || !req.file) {
      return res.status(400).json({ error: "Missing required fields or file." });
    }
  
    const filePath = req.file.path;
  
    const questionsQuery =
      "INSERT INTO questions (subject_id, unit_id, question_text, question_type, explanation, media_path, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING question_id";
    const optionsQuery =
      "INSERT INTO question_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)";
  
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      // Parse CSV and process questions and options
      const parseCSV = new Promise((resolve, reject) => {
        const questionsData = [];
  
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => {
            const {
              question_text,
              question_type,
              option_1,
              option_2,
              option_3,
              option_4,
              option_5,
              option_6,
              correct_option,
              explanation,
              media_path,
            } = row;
  
            const options = [option_1, option_2, option_3, option_4, option_5, option_6]
              .map((option, index) => ({
                option_text: option,
                is_correct: correct_option
                  ?.split(",")
                  .map((num) => num.trim())
                  .includes((index + 1).toString()),
              }))
              .filter((option) => option.option_text); // Remove null/empty options
  
            questionsData.push({
              question: [subject_id, unit_id, question_text, question_type, explanation, media_path],
              options,
            });
          })
          .on("end", () => resolve(questionsData))
          .on("error", reject);
      });
  
      const questionsData = await parseCSV;
  
      for (const { question, options } of questionsData) {
        const result = await client.query(questionsQuery, question);
        const question_id = result.rows[0].question_id;
  
        for (const option of options) {
          await client.query(optionsQuery, [question_id, option.option_text, option.is_correct]);
        }
      }
  
      await client.query("COMMIT");
      res.json({ message: "Questions uploaded successfully." });
    } catch (err) {
      console.error("Error processing upload:", err);
      await client.query("ROLLBACK");
      res.status(500).json({ error: "Failed to upload questions." });
    } finally {
      client.release();
      // Cleanup temporary file
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temporary file:", unlinkErr);
        });
      }
    }
  }); 
  
// Endpoint to download the CSV template
router.get("/ques/template", authenticate, (req, res) => {
    const templatePath = path.join(__dirname, "../templates/questions_template.csv");
  
    res.download(templatePath, "questions_template.csv", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download the template." });
      }
    });
  });  

export default router;
