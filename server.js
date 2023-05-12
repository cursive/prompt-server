const express = require('express');
const app = express();
const port = 3000;

// Define routes
app.get('/', (req, res) => {
    res.send('Helloooo, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
