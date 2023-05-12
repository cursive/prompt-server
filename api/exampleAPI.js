const express = require('express');
const router = express.Router();

// Define API routes
router.post('/message', (req, res) => {
    const message = 'This is a simple API message.';
    res.json({ message });
});

module.exports = router;