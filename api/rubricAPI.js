
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const rubricDataPath = join(dirname(dirname(__filename)), 'data', 'rubricData.json');


router.post('/createrubric', (req, res) => {
    console.log("Server /createrubricAPI")
    const { title } = req.body;
    const description = 'Some description'; // Replace with your desired description
    const currentDate = new Date().toISOString(); // Get current date
    const udid = uuidv4(); // Generate UUID

    const newEntry = {
        title,
        description,
        currentDate,
        udid
    };

    fs.readFile(rubricDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read rubricData file.' });
        }

        let rubricData = [];
        if (data) {
            try {
                rubricData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse rubricData file.' });
            }
        }

        rubricData.push(newEntry);

        fs.writeFile(rubricDataPath, JSON.stringify(rubricData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Failed to write to rubricData file.' });
            }

            console.log('createrubric', newEntry);
            res.json({ message: 'Rubric entry created successfully.' });
        });
    });
});

router.get('/rubricdata', (req, res) => {
    fs.readFile(rubricDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read rubricData file.' });
        }

        let rubricData = [];
        if (data) {
            try {
                rubricData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse rubricData file.' });
            }
        }

        res.json(rubricData);
    });
});

router.put('/updaterubric/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    fs.readFile(rubricDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read rubricData file.' });
        }

        let rubricData = [];
        if (data) {
            try {
                rubricData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse rubricData file.' });
            }
        }

        const existingEntry = rubricData.find((entry) => entry.udid === id);
        if (!existingEntry) {
            return res.status(404).json({ message: 'Rubric entry not found.' });
        }

        existingEntry.title = title;
        existingEntry.description = description;

        fs.writeFile(rubricDataPath, JSON.stringify(rubricData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Failed to write to rubricData file.' });
            }

            console.log('updaterubric', existingEntry);
            res.json({ message: 'Rubric entry updated successfully.' });
        });
    });
});


router.delete('/deleterubric/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(rubricDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read rubricData file.' });
        }

        let rubricData = [];
        if (data) {
            try {
                rubricData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse rubricData file.' });
            }
        }

        const index = rubricData.findIndex((entry) => entry.udid === id);
        if (index === -1) {
            return res.status(404).json({ message: 'Rubric entry not found.' });
        }

        rubricData.splice(index, 1);

        fs.writeFile(rubricDataPath, JSON.stringify(rubricData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Failed to write to rubricData file.' });
            }

            console.log('deleterubric', id);
            res.json({ message: 'Rubric entry deleted successfully.' });
        });
    });
});


// Define API route to get rubric by ID
router.get('/getRubricByID/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile(rubricDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read rubricData file.' });
        }

        let rubricData = [];
        if (data) {
            try {
                rubricData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse rubricData file.' });
            }
        }

        const rubric = rubricData.find(entry => entry.udid === id);
        if (!rubric) {
            return res.status(404).json({ message: 'Rubric not found.' });
        }

        res.json(rubric);
    });
});

export default router;
