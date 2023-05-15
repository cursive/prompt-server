import dotenv from 'dotenv';
import express from 'express';
import basicAuth from 'basic-auth'; // Import basic-auth middleware
dotenv.config({ path: './.env' });
import exampleAPI from './api/exampleAPI.js';
import promptAPI from './api/promptAPI.js';

const app = express();
const port = 3000;

// Check environment and configure environment variables accordingly
if (process.env.NODE_ENV === 'replit') {
    // Replit environment, access secrets directly
    console.log("Running on replit, here is the API key", process.env.OPENAI_API_KEY);
} else {
    // Local development environment
    console.log("Running locally, here is the API key", process.env.OPENAI_API_KEY);
}

// Serve static files from the "static" directory
app.use((req, res, next) => {
    // Define your username and password
    const username = 'essayreviewer';
    const password = 'pencil-rubber-paper';

    const credentials = basicAuth(req);

    if (!credentials || credentials.name !== username || credentials.pass !== password) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.sendStatus(401);
        return;
    }

    next();
});
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