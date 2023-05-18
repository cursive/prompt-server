import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const promptDataPath = join(dirname(dirname(__filename)), 'data', 'promptData.json');

// Create a prompt and append it to the JSON file
router.post('/createPrompt', (req, res) => {
    const { title, description, author } = req.body;
    const currentDate = new Date().toISOString();
    const prompt = {
        uuid: uuidv4(),
        title,
        description,
        author,
        date: currentDate
    };

    fs.readFile(promptDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read promptData file.' });
        }

        let promptData = [];
        if (data) {
            try {
                promptData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse promptData file.' });
            }
        }

        promptData.push(prompt);

        fs.writeFile(promptDataPath, JSON.stringify(promptData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Failed to write to promptData file.' });
            }

            console.log('createPrompt', prompt);
            res.json({ message: 'Prompt created successfully.' });
        });
    });
});

// Get all prompts
router.get('/getAllPrompts', (req, res) => {
    fs.readFile(promptDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read promptData file.' });
        }

        let promptData = [];
        if (data) {
            try {
                promptData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse promptData file.' });
            }
        }

        res.json(promptData);
    });
});

// Get a single prompt by UUID
router.get('/getSinglePrompt/:uuid', (req, res) => {
    const { uuid } = req.params;

    fs.readFile(promptDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read promptData file.' });
        }

        let promptData = [];
        if (data) {
            try {
                promptData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse promptData file.' });
            }
        }

        const prompt = promptData.find((p) => p.uuid === uuid);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found.' });
        }

        res.json(prompt);
    });
});

// Update a prompt by UUID
router.put('/updatePrompt/:uuid', (req, res) => {
    const { uuid } = req.params;
    const { title, description, author } = req.body;

    fs.readFile(promptDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read promptData file.' });
        }

        let promptData = [];
        if (data) {
            try {
                promptData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse promptData file.' });
            }
        }

        const promptIndex = promptData.findIndex((p) => p.uuid === uuid);
        if (promptIndex === -1) {
            return res.status(404).json({ message: 'Prompt not found.' });
        }

        const updatedPrompt = {
            ...promptData[promptIndex],
            title: title || promptData[promptIndex].title,
            description: description || promptData[promptIndex].description,
            author: author || promptData[promptIndex].author
        };

        promptData[promptIndex] = updatedPrompt;

        fs.writeFile(promptDataPath, JSON.stringify(promptData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Failed to write to promptData file.' });
            }

            console.log('updatePrompt', updatedPrompt);
            res.json({ message: 'Prompt updated successfully.' });
        });
    });
});

// Delete a prompt by UUID
router.delete('/deletePrompt/:uuid', (req, res) => {
    const { uuid } = req.params;

    fs.readFile(promptDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read promptData file.' });
        }

        let promptData = [];
        if (data) {
            try {
                promptData = JSON.parse(data);
            } catch (parseError) {
                console.error(parseError);
                return res.status(500).json({ message: 'Failed to parse promptData file.' });
            }
        }

        const promptIndex = promptData.findIndex((p) => p.uuid === uuid);
        if (promptIndex === -1) {
            return res.status(404).json({ message: 'Prompt not found.' });
        }

        const deletedPrompt = promptData.splice(promptIndex, 1)[0];

        fs.writeFile(promptDataPath, JSON.stringify(promptData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Failed to write to promptData file.' });
            }

            console.log('deletePrompt', deletedPrompt);
            res.json({ message: 'Prompt deleted successfully.' });
        });
    });
});

export default router;
