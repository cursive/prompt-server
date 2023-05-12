import dotenv from 'dotenv';
import express from 'express';
dotenv.config({ path: './.env' });
import exampleAPI from './api/exampleAPI.js';
import promptAPI from './api/promptAPI.js';


console.log("in server", process.env.OPENAI_API_KEY)


const app = express();
const port = 3000;

// Serve static files from the "static" directory
app.use(express.static('static'));

// API code
app.use(express.json()); // Parse JSON request bodies
app.use('/api', exampleAPI); // Mount example API at /api
app.use('/api', promptAPI); // Mount prompt API at /api

// Define root route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});