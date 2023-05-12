const exampleAPI = require('./api/exampleAPI');
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "static" directory
app.use(express.static('static'));

// API code
app.use(express.json()); // Parse JSON request bodies
app.use('/api', exampleAPI); // Mount example API at /api

// Define root route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});