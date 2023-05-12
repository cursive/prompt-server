import express from 'express';

const router = express.Router();

// Define API routes
router.post('/message', (req, res) => {
    const message = 'This is a simple API message.';
    res.json({ message });
});

export default router;