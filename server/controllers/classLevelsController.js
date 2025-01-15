import db from "../utils/db.js"
import express from 'express';
import authenticate from '../middlewares/authenticate.js';

const classLevelRouter = express.Router();

// Get all class levels
classLevelRouter.get('/classlevels', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM class_levels ORDER BY class_id');
        //console.log(result);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a subject
classLevelRouter.post('/classlevels', async (req, res) => {
    const { level_name, description} = req.body;
    //console.log(`${subject_name} ${description} ${class_id}`);
    try {
        const result = await db.query(
            'INSERT INTO class_levels (level_name, description) VALUES ($1, $2) RETURNING *',
            [level_name, description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a subject
classLevelRouter.put('/classlevels/:id', async (req, res) => {
    const { id } = req.params;
    const { level_name, description } = req.body;
    try {
        const result = await db.query(
            'UPDATE class_levels SET level_name = $1, description = $2 WHERE class_id = $3 RETURNING *',
            [level_name, description,id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a subject
classLevelRouter.delete('/classlevels/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM class_levels WHERE class_id = $1', [id]);
        res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default classLevelRouter;
