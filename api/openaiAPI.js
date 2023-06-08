import { Configuration, OpenAIApi } from "openai";
import express from "express";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });




const router = express.Router();
console.log("openaiAPI.js jsut started")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-bB07M3DWbjAl8c5MzXlwxH6q"
});
console.log("OpenAPI key", process.env.OPENAI_API_KEY)
const openai = new OpenAIApi(configuration);

router.post('/openai', async (req, res) => {
    console.log("Server /prompt, key is", configuration.apiKey)
    if (!configuration.apiKey) {
        console.log("Server: OpenAI API key not configured, please follow instructions in README.md")
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }
    console.log("API Key OK, check if there's an essay")
    var promptintro = req.body.prompt || '';
    promptintro = promptintro.replace(/\n/g, '');
    var rubric = req.body.rubric || '';
    rubric = rubric.replace(/\n/g, '');
    const rubricString = JSON.stringify(rubric);
    console.log("Sending prompt and rubric to OpenAI")
    // console.log(promptintro + rubric)
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            max_tokens: 4000,
            messages: [
                {
                    "role": "system",
                    "content": promptintro + rubricString
                }
            ],
            temperature: 0.6,
        });
        console.log("Server: 200 ok, show data")
        console.log("completion.data.choices[0].message")
        console.log(completion.data.choices[0].message);
        console.log("end data")
        res.status(200).json({ result: completion.data.choices[0].message });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.log("Error with OpenAI API request")
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
});



function generatePrompt(prompt, rubric) {
    return prompt + rubric;
}


// model: "text-davinci-003",
// max_tokens: 2000,
// prompt: promptintro + rubricString,
// temperature: 0.6,



export default router;
