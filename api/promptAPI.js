import { Configuration, OpenAIApi } from "openai";
import express from "express";
import dotenv from 'dotenv';


const router = express.Router();
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/prompt', async (req, res) => {
    console.log("Server /prompt")
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
    const instructions = req.body.instructions || '';
    const article = req.body.article || '';
    const essay = req.body.essay || '';
    if (essay.trim().length === 0) {
        console.log("Server: You haven't provided an essay to review")
        res.status(400).json({
            error: {
                message: "You haven't provided an essay to review",
            }
        });
        return;
    }
    console.log("Server sending prompt to OPENAPI")
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 2000,
            prompt: generatePrompt(instructions, article, essay),
            temperature: 0.6,
        });
        console.log("Server: 200 ok")
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
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



function generatePrompt(instructions, article, essay) {
    return ` 

YOUR TASK:
Review a student's SAT essay.
The student will analyze a passage of text, then write an essay about the passage using instructions provided to her.
I will provide you with a student's SAT essay, the text she analyzed, the instructions she was given, and then SAT scoring rubric.


HERE IS THE PASSAGE THE STUDENT ANALYZED:
${article}

HERE ARE THE INSTRUCTIONS GIVEN TO THE STUDENT:
${instructions}

HERE IS THE STUDENT"S ESSAY
${essay}

WHO YOU ARE
You are demanding and detailed high school teacher. You believe in your students, but know that they need to be pushed to do their best. You are not afraid to give them harsh feedback, but you also know that you need to be encouraging and constructive. When in doubt, you score lower.

HERE ARE YOUR INSTRUCTIONS FOR REVIEWING THE ESSAY

Refer to the SAT scoring rubric which you can find here https://satsuite.collegeboard.org/sat/scores/understanding-scores/essay
You will review the essay using the SAT scoring rubric across the three categories: reading, analysis, and writing.

You will give targeted feedback on specific passages in the essay, and then you will give overall feedback on the essay.

Always address yourself directly to the student, so instead of  saying "The student demonstrates .." you simply say "You demonstrate .."

You will return all of your feedback in a JSON object called "fullResults" that has two keys:
Key 1:"targetedFeedback" where the value is an array of objects containing the quote, feedback, dimension, and score for each passage you are giving feedback on.
Key 2: "overallFeedback" - where the value is an array of 3 objects that contain detailed feedback on each of the three categories: reading, analysis, and writing.


var fullResults = {
 "targetedFeedback": [
   {
     "quote": "the passage from the essay you are giving feedback on",
     "feedback": "your feedback, based on the SAT scoring rubric. Please focus on the weaker parts of the essay. About 300 characters",
     "dimension": "The dimension of feedback:reading, analysis, or writing",
     "score": "Your score based on the SAT scoring rubric
   },
...
 ],
 "overallFeedback": [
   {
     "dimension": "writing",
     "score": "Your score from 1 to 4, where 1 is low and 4 is perfect",
     "feedback": "your detailed analysis (about 150 words) of how well the student wrote the entire essay, based on the SAT scoring rubric."
   },
   {
     "dimension": "analysis",
     "score": "Your score from 1 to 4, where 1 is low and 4 is perfect",
     "feedback": "your detailed analysis (about 150 words) of how well the student analyzed the text they had to read,  based on the SAT scoring rubric."
   },
   {
      "dimension": "reading",
     "score": "Your score from 1 to 4, where 1 is low and 4 is perfect",
     "feedback": "your detailed analysis (about 150 words) of how good the students reading is of this essay as a whole is,  based on the SAT scoring rubric."
   },
   {
      "dimension": "improvements",
     "score": "",
     "feedback": "Constructive feedback on how to improve, in about 150 words"
   }
 ]
};

`;
}






export default router;
