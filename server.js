const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "static" directory
app.use(express.static('static'));

// Define root route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
