import db from "../utils/db.js"
import express from 'express';
import authenticate from '../middlewares/authenticate.js';

const subjectRouter = express.Router();

// Get all subjects
subjectRouter.get('/subjects', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM subjects ORDER BY subject_id');
        //console.log(result);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a subject
subjectRouter.post('/subjects', async (req, res) => {
    const { subject_name, description, class_id } = req.body;
    //console.log(`${subject_name} ${description} ${class_id}`);
    try {
        const result = await db.query(
            'INSERT INTO subjects (subject_name, description, class_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [subject_name, description, class_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a subject
subjectRouter.put('/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { subject_name, description, class_id } = req.body;
    //console.log(subject_name);
    try {
        const result = await db.query(
            'UPDATE subjects SET subject_name = $1, description = $2, class_id = $3 WHERE subject_id = $4 RETURNING *',
            [subject_name, description, class_id, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a subject
subjectRouter.delete('/subjects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM subjects WHERE subject_id = $1', [id]);
        res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default subjectRouter;
