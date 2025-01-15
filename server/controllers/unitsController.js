import db from "../utils/db.js"
import express from 'express';
import authenticate from '../middlewares/authenticate.js';

const unitsRouter = express.Router();

// Get all units
unitsRouter.get('/units', async (req, res) => {
    const queryString = `SELECT u.unit_id,
                        u.unit_name,
                        u.subject_id,     
                        s.subject_name
                        FROM units u
                        JOIN subjects s on u.subject_id = s.subject_id
                        ORDER BY unit_id`
    try {
        const result = await db.query(queryString);
        //console.log(result);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a unit
unitsRouter.post('/units', async (req, res) => {
    const { unit_name, subject_id } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO units (unit_name, subject_id, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [unit_name, subject_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a unit
unitsRouter.put('/units/:id', async (req, res) => {
    const { id } = req.params;
    const { unit_name, subject_id } = req.body;

    try {
        const result = await db.query(
            'UPDATE units SET unit_name = $1, subject_id = $2 WHERE unit_id = $3 RETURNING *',
            [unit_name, subject_id, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a unit
unitsRouter.delete('/units/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM units WHERE unit_id = $1', [id]);
        res.json({ message: 'Unit deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default unitsRouter;
