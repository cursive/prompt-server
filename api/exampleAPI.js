import express from 'express';

const router = express.Router();

// Define API routes
router.post('/message', (req, res) => {
    console.log("Server in message")
    const message = 'This is a simple API message I jusrt updated.';
    res.json({ message });
});

export default router;