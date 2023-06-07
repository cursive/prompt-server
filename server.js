import dotenv from 'dotenv';
import express from 'express';
import basicAuth from 'basic-auth'; // Import basic-auth middleware
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // Add this line
dotenv.config({ path: './.env' });
import exampleAPI from './api/exampleAPI.js';
import openaiAPI from './api/openaiAPI.js';
import rubricAPI from './api/rubricAPI.js';
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




// Define authentication middleware
const authenticate = (req, res, next) => {
    if (req.path.startsWith('/public')) {
        // Define your username and password
        const username = 'essayreviewer';
        const password = 'phone-fork-file';
        const credentials = basicAuth(req);
        if (!credentials || credentials.name !== username || credentials.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
            res.sendStatus(401);
            return;
        }
    }
    next();
};



// Apply authentication middleware
app.use(authenticate);

// Serve static files from the "static" directory
app.use(express.static('public'));



// API code
app.use(express.json()); // Parse JSON request bodies
app.use('/api', exampleAPI); // Mount example API at /api
app.use('/api', openaiAPI); // Mount prompt API at /api
app.use('/api', rubricAPI); // Mount example API at /api
app.use('/api', promptAPI); // Mount example API at /api


// Define root route
app.get('/', (req, res) => {
    const htmlContent = `
        <h1>Essay Review</h1>
        <a href="essayreview/index.html">Essay review</a>
        <a href="prompts/promptlist.html">List of prompts</a>
        <a href="prompts/rubriclist.html">List of rubrics</a>
    `;
    res.send(htmlContent);
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});