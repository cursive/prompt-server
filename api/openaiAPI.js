import { Configuration, OpenAIApi } from "openai";
import express from "express";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();
console.log("openaiAPI.js jsut started")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
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

    const promptinfo = req.body.promptinfo || '';
    if (promptinfo.trim().length === 0) {
        console.log("Server: You haven't provided a prompt")
        res.status(400).json({
            error: {
                message: "You haven't provided an essay to review",
            }
        });
        return;
    }
    console.log("Server sending prompt to OPENAPI")
    try {
        console.log("---------req.body.promptinfo: ")

        //const sanitizedPrompt = generatePrompt(req.body.promptinfo)
        const sanitizedPrompt = replitPrompt()
        console.log(sanitizedPrompt)
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 2000,
            prompt: replitPrompt(),
            temperature: 0.6,
        });

        console.log("Server: 200 OK")
        console.log("---------Display results: ")
        console.log("Completion data:");
        console.log(completion.data);

        if (completion.data && completion.data.choices && completion.data.choices.length > 0) {
            //const generatedText = completion.data.choices[0].text;
            const generatedText = completion.data.choices[0].text.trim();
            console.log("Generated text:");
            console.log(generatedText);
            res.status(200).json({ result: generatedText });
        } else {
            console.log("OpenAI API response does not contain valid data.");
            res.status(500).json({ error: "Failed to generate text." });
        }
        console.log("Usage:");
        console.log(completion.data.usage);

        console.log("---------End results ")
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




function generatePrompt(theprompt) {
    return
    ` 

You will return all of your feedback in a JSON object called "fullResults" that has two keys:
Key 1:"targetedFeedback" where the value is an array of objects containing the quote, feedback, dimension, and score for each passage you are giving feedback on.
Key 2: "overallFeedback" - where the value is an array of 3 objects that contain detailed feedback on each of the three categories: reading, analysis, and writing, and suggestions for improvements


var fullResults = {
 "targetedFeedback": [
   {
     "quote": "the passage from the essay you are giving feedback on",
     "feedback": "your feedback, based on the SAT scoring rubric. Please focus on the weaker parts of the essay. About 150 characters",
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
...
 ]
};`;
}


function simplePrompt() {
    return `YOUR TASK:
Review a student's SAT essay.
The student will analyze a passage of text, then write an essay about the passage using instructions provided to her.
I will provide you with a student's SAT essay, the text she analyzed, the instructions she was given, and then SAT scoring rubric.


HERE IS THE PASSAGE THE STUDENT ANALYZED:
Adapted from Dana Gioia, “Why Literature Matters.” © 2005 by The New York Times Company. Originally published April 10, 2005.
A strange thing has happened in the American arts during the past quarter century. While income rose to unforeseen levels, college attendance ballooned, and access to information increased enormously, the interest young Americans showed in the arts—and especially literature—actually diminished.
According to the 2002 Survey of Public Participation in the Arts, a population study designed and commissioned by the National Endowment for the Arts (and executed by the US Bureau of the Census), arts participation by Americans has declined for eight of the nine major forms that are measured. . . . The declines have been most severe among younger adults (ages 18-24). The most worrisome finding in the 2002 study, however, is the declining percentage of Americans, especially young adults, reading literature.
That individuals at a time of crucial intellectual and emotional development bypass the joys and challenges of literature is a troubling trend. If it were true that they substituted histories, biographies, or political works for literature, one might not worry. But book reading of any kind is falling as well.
That such a longstanding and fundamental cultural activity should slip so swiftly, especially among young adults, signifies deep transformations in contemporary life. To call attention to the trend, the Arts Endowment issued the reading portion of the Survey as a separate report, “Reading at Risk: A Survey of Literary Reading in America.”
The decline in reading has consequences that go beyond literature. The significance of reading has become a persistent theme in the business world. The February issue of Wired magazine, for example, sketches a new set of mental skills and habits proper to the 21st century, aptitudes decidedly literary in character: not “linear, logical, analytical talents,” author Daniel Pink states, but “the ability to create artistic and emotional beauty, to detect patterns and opportunities, to craft a satisfying narrative.” When asked what kind of talents they like to see in management positions, business leaders consistently set imagination, creativity, and higher-order thinking at the top.
Ironically, the value of reading and the intellectual faculties that it inculcates appear most clearly as active and engaged literacy declines. There is now a growing awareness of the consequences of nonreading to the workplace. In 2001 the National Association of Manufacturers polled its members on skill deficiencies among employees. Among hourly workers, poor reading skills ranked second, and 38 percent of employers complained that local schools inadequately taught reading comprehension.
The decline of reading is also taking its toll in the civic sphere. . . . A 2003 study of 15- to 26-year-olds’ civic knowledge by the National Conference of State Legislatures concluded, “Young people do not understand the ideals of citizenship . . . and their appreciation and support of American democracy is limited.”
It is probably no surprise that declining rates of literary reading coincide with declining levels of historical and political awareness among young people. One of the surprising findings of “Reading at Risk” was that literary readers are markedly more civically engaged than nonreaders, scoring two to four times more likely to perform charity work, visit a museum, or attend a sporting event. One reason for their higher social and cultural interactions may lie in the kind of civic and historical knowledge that comes with literary reading. . . .
The evidence of literature’s importance to civic, personal, and economic health is too strong to ignore. The decline of literary reading foreshadows serious long-term social and economic problems, and it is time to bring literature and the other arts into discussions of public policy. Libraries, schools, and public agencies do noble work, but addressing the reading issue will require the leadership of politicians and the business community as well. . . .
Reading is not a timeless, universal capability. Advanced literacy is a specific intellectual skill and social habit that depends on a great many educational, cultural, and economic factors. As more Americans lose this capability, our nation becomes less informed, active, and independent-minded. These are not the qualities that a free, innovative, or productive society can afford to lose.

HERE ARE THE INSTRUCTIONS GIVEN TO THE STUDENT:
As you read the passage, consider how Dana Gioia uses the following. Evidence: such as facts or examples, to support claims. Reasoning: to develop ideas and to connect claims and finally stylistic or persuasive elements, such as word choice or appeals to emotion, to add power to the ideas expressed.

Write an essay in which you explain how Dana Gioia builds an argument to persuade his audience that the decline of reading in America will have a negative effect on society. In your essay, analyze how Gioia uses one or more of the features listed in the box above (or features of your own choice) to strengthen the logic and persuasiveness of his argument. Be sure that your analysis focuses on the most relevant features of the passage.
Your essay should not explain whether you agree with Gioia’s claims, but rather explain how Gioia builds an argument to persuade his audience.

HERE IS THE STUDENT"S ESSAY
In Paul Bogard's article “Let there be dark” he's building an arguement to persuade his audience to preserve natural darkness. Bogard builds his arguement in a few different ways. Bogard uses a personal story, appeals to people's emotions, and states benefits of natural darkness. By using a personal story Bogard allows his audience to connect to him. If his audience can relate or even understand his story they will be more willing to agree with him. The personal story also shows that the issue of preserving natural darkness isn't just another topic to write about but something that he is actually passionate for. In his personal story Bogard uses great imagery making the audience picture what he saw and maybe make them want to experience it too. 

Bogard uses pathos by stating examples that appeal to people's emotions. In the article he wrote “Those of us over 35 are perhaps among the last generation to have known truly dark nights.” This statement appeals more to the younger generations emotion. By stating this people who are younger then 35 might feel that they were robbed of the oppurtunity to experience the real beauty of natural darkness. This would proably help his younger audience to agree with him because they might want the chance to see the real beauty of natural darkness.

Bogard writes about the benefits that natural darkness actually produces. In the article he talks about how darkens actually helps the body produce a hormone that keeps certain cancers from developing. He also includes how darkness helps and is neccessary for certain animals. These examples will help his audience see that he is arguing for some benefical for people. This also helps appeal to an audience that might not care for the beauty of darkness but care for their own personal health. 

Bogard uses different features in order to persuade his audience. The different features also help him in appealing to a broader audience.



HERE ARE YOUR INSTRUCTIONS FOR REVIEWING THE ESSAY

Refer to the SAT scoring rubric which you can find here https://satsuite.collegeboard.org/sat/scores/understanding-scores/essay
You will review the essay using the SAT scoring rubric across the three categories: reading, analysis, and writing.

You will give targeted feedback on specific passages in the essay, and then you will give overall feedback on the essay.

Always address yourself directly to the student, so instead of  saying "The student demonstrates .." you simply say "You demonstrate .."

You will return all of your feedback in a JSON object called "fullResults" that has two keys:
Key 1:"targetedFeedback" where the value is an array of objects containing the quote, feedback, dimension, and score for each passage you are giving feedback on.
Key 2: "overallFeedback" - where the value is an array of 3 objects that contain detailed feedback on each of the three categories: reading, analysis, and writing, and suggestions for improvements`
}

function jsonPrompt() {
    return `YOUR TASK:
Review a student's SAT essay.
The student will analyze a passage of text, then write an essay about the passage using instructions provided to her.
I will provide you with a student's SAT essay, the text she analyzed, the instructions she was given, and then SAT scoring rubric.


HERE IS THE PASSAGE THE STUDENT ANALYZED:
Adapted from Dana Gioia, “Why Literature Matters.” © 2005 by The New York Times Company. Originally published April 10, 2005.
A strange thing has happened in the American arts during the past quarter century. While income rose to unforeseen levels, college attendance ballooned, and access to information increased enormously, the interest young Americans showed in the arts—and especially literature—actually diminished.
According to the 2002 Survey of Public Participation in the Arts, a population study designed and commissioned by the National Endowment for the Arts (and executed by the US Bureau of the Census), arts participation by Americans has declined for eight of the nine major forms that are measured. . . . The declines have been most severe among younger adults (ages 18-24). The most worrisome finding in the 2002 study, however, is the declining percentage of Americans, especially young adults, reading literature.
That individuals at a time of crucial intellectual and emotional development bypass the joys and challenges of literature is a troubling trend. If it were true that they substituted histories, biographies, or political works for literature, one might not worry. But book reading of any kind is falling as well.
That such a longstanding and fundamental cultural activity should slip so swiftly, especially among young adults, signifies deep transformations in contemporary life. To call attention to the trend, the Arts Endowment issued the reading portion of the Survey as a separate report, “Reading at Risk: A Survey of Literary Reading in America.”
The decline in reading has consequences that go beyond literature. The significance of reading has become a persistent theme in the business world. The February issue of Wired magazine, for example, sketches a new set of mental skills and habits proper to the 21st century, aptitudes decidedly literary in character: not “linear, logical, analytical talents,” author Daniel Pink states, but “the ability to create artistic and emotional beauty, to detect patterns and opportunities, to craft a satisfying narrative.” When asked what kind of talents they like to see in management positions, business leaders consistently set imagination, creativity, and higher-order thinking at the top.
Ironically, the value of reading and the intellectual faculties that it inculcates appear most clearly as active and engaged literacy declines. There is now a growing awareness of the consequences of nonreading to the workplace. In 2001 the National Association of Manufacturers polled its members on skill deficiencies among employees. Among hourly workers, poor reading skills ranked second, and 38 percent of employers complained that local schools inadequately taught reading comprehension.
The decline of reading is also taking its toll in the civic sphere. . . . A 2003 study of 15- to 26-year-olds’ civic knowledge by the National Conference of State Legislatures concluded, “Young people do not understand the ideals of citizenship . . . and their appreciation and support of American democracy is limited.”
It is probably no surprise that declining rates of literary reading coincide with declining levels of historical and political awareness among young people. One of the surprising findings of “Reading at Risk” was that literary readers are markedly more civically engaged than nonreaders, scoring two to four times more likely to perform charity work, visit a museum, or attend a sporting event. One reason for their higher social and cultural interactions may lie in the kind of civic and historical knowledge that comes with literary reading. . . .
The evidence of literature’s importance to civic, personal, and economic health is too strong to ignore. The decline of literary reading foreshadows serious long-term social and economic problems, and it is time to bring literature and the other arts into discussions of public policy. Libraries, schools, and public agencies do noble work, but addressing the reading issue will require the leadership of politicians and the business community as well. . . .
Reading is not a timeless, universal capability. Advanced literacy is a specific intellectual skill and social habit that depends on a great many educational, cultural, and economic factors. As more Americans lose this capability, our nation becomes less informed, active, and independent-minded. These are not the qualities that a free, innovative, or productive society can afford to lose.

HERE ARE THE INSTRUCTIONS GIVEN TO THE STUDENT:
As you read the passage, consider how Dana Gioia uses the following. Evidence: such as facts or examples, to support claims. Reasoning: to develop ideas and to connect claims and finally stylistic or persuasive elements, such as word choice or appeals to emotion, to add power to the ideas expressed.

Write an essay in which you explain how Dana Gioia builds an argument to persuade his audience that the decline of reading in America will have a negative effect on society. In your essay, analyze how Gioia uses one or more of the features listed in the box above (or features of your own choice) to strengthen the logic and persuasiveness of his argument. Be sure that your analysis focuses on the most relevant features of the passage.
Your essay should not explain whether you agree with Gioia’s claims, but rather explain how Gioia builds an argument to persuade his audience.

HERE IS THE STUDENT"S ESSAY
In Paul Bogard's article “Let there be dark” he's building an arguement to persuade his audience to preserve natural darkness. Bogard builds his arguement in a few different ways. Bogard uses a personal story, appeals to people's emotions, and states benefits of natural darkness. By using a personal story Bogard allows his audience to connect to him. If his audience can relate or even understand his story they will be more willing to agree with him. The personal story also shows that the issue of preserving natural darkness isn't just another topic to write about but something that he is actually passionate for. In his personal story Bogard uses great imagery making the audience picture what he saw and maybe make them want to experience it too. 

Bogard uses pathos by stating examples that appeal to people's emotions. In the article he wrote “Those of us over 35 are perhaps among the last generation to have known truly dark nights.” This statement appeals more to the younger generations emotion. By stating this people who are younger then 35 might feel that they were robbed of the oppurtunity to experience the real beauty of natural darkness. This would proably help his younger audience to agree with him because they might want the chance to see the real beauty of natural darkness.

Bogard writes about the benefits that natural darkness actually produces. In the article he talks about how darkens actually helps the body produce a hormone that keeps certain cancers from developing. He also includes how darkness helps and is neccessary for certain animals. These examples will help his audience see that he is arguing for some benefical for people. This also helps appeal to an audience that might not care for the beauty of darkness but care for their own personal health. 

Bogard uses different features in order to persuade his audience. The different features also help him in appealing to a broader audience.



HERE ARE YOUR INSTRUCTIONS FOR REVIEWING THE ESSAY

Refer to the SAT scoring rubric which you can find here https://satsuite.collegeboard.org/sat/scores/understanding-scores/essay
You will review the essay using the SAT scoring rubric across the three categories: reading, analysis, and writing.

You will give targeted feedback on specific passages in the essay, and then you will give overall feedback on the essay.

Always address yourself directly to the student, so instead of  saying "The student demonstrates .." you simply say "You demonstrate .."

You will return all of your feedback in a JSON object called "fullResults" that has two keys:
Key 1:"targetedFeedback" where the value is an array of objects containing the quote, feedback, dimension, and score for each passage you are giving feedback on.
Key 2: "overallFeedback" - where the value is an array of 3 objects that contain detailed feedback on each of the three categories: reading, analysis, and writing, and suggestions for improvements


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
...
 ]
};`
}


function replitPrompt() {
    return `YOUR TASK:
Review a student's SAT essay.
The student will analyze a passage of text, then write an essay about the passage using instructions provided to her.
I will provide you with a student's SAT essay, the text she analyzed, the instructions she was given, and then SAT scoring rubric.


HERE IS THE PASSAGE THE STUDENT ANALYZED:
Adapted from Dana Gioia, “Why Literature Matters.” © 2005 by The New York Times Company.Originally published April 10, 2005.
A strange thing has happened in the American arts during the past quarter century.While income rose to unforeseen levels, college attendance ballooned, and access to information increased enormously, the interest young Americans showed in the arts—and especially literature—actually diminished.
According to the 2002 Survey of Public Participation in the Arts, a population study designed and commissioned by the National Endowment for the Arts(and executed by the US Bureau of the Census), arts participation by Americans has declined for eight of the nine major forms that are measured. . . .The declines have been most severe among younger adults(ages 18 - 24).The most worrisome finding in the 2002 study, however, is the declining percentage of Americans, especially young adults, reading literature.
That individuals at a time of crucial intellectual and emotional development bypass the joys and challenges of literature is a troubling trend.If it were true that they substituted histories, biographies, or political works for literature, one might not worry.But book reading of any kind is falling as well.
That such a longstanding and fundamental cultural activity should slip so swiftly, especially among young adults, signifies deep transformations in contemporary life.To call attention to the trend, the Arts Endowment issued the reading portion of the Survey as a separate report, “Reading at Risk: A Survey of Literary Reading in America.”
The decline in reading has consequences that go beyond literature.The significance of reading has become a persistent theme in the business world.The February issue of Wired magazine, for example, sketches a new set of mental skills and habits proper to the 21st century, aptitudes decidedly literary in character: not “linear, logical, analytical talents,” author Daniel Pink states, but “the ability to create artistic and emotional beauty, to detect patterns and opportunities, to craft a satisfying narrative.” When asked what kind of talents they like to see in management positions, business leaders consistently set imagination, creativity, and higher - order thinking at the top.
Ironically, the value of reading and the intellectual faculties that it inculcates appear most clearly as active and engaged literacy declines.There is now a growing awareness of the consequences of nonreading to the workplace.In 2001 the National Association of Manufacturers polled its members on skill deficiencies among employees.Among hourly workers, poor reading skills ranked second, and 38 percent of employers complained that local schools inadequately taught reading comprehension.
The decline of reading is also taking its toll in the civic sphere. . . .A 2003 study of 15 - to 26 - year - olds’ civic knowledge by the National Conference of State Legislatures concluded, “Young people do not understand the ideals of citizenship. . .and their appreciation and support of American democracy is limited.”
It is probably no surprise that declining rates of literary reading coincide with declining levels of historical and political awareness among young people.One of the surprising findings of “Reading at Risk” was that literary readers are markedly more civically engaged than nonreaders, scoring two to four times more likely to perform charity work, visit a museum, or attend a sporting event.One reason for their higher social and cultural interactions may lie in the kind of civic and historical knowledge that comes with literary reading. . . .
The evidence of literature’s importance to civic, personal, and economic health is too strong to ignore.The decline of literary reading foreshadows serious long - term social and economic problems, and it is time to bring literature and the other arts into discussions of public policy.Libraries, schools, and public agencies do noble work, but addressing

HERE ARE THE INSTRUCTIONS GIVEN TO THE STUDENT:
As you read the passage below, consider how Dana Gioia uses the following. Evidence: such as facts or examples, to support claims. Reasoning: to develop ideas and to connect claims and finally stylistic or persuasive elements, such as word choice or appeals to emotion, to add power to the ideas expressed.

HERE IS THE STUDENT"S ESSAY
In Paul Bogard's article “Let there be dark” he's building an arguement to persuade his audience to preserve natural darkness. Bogard builds his arguement in a few different ways. Bogard uses a personal story, appeals to people's emotions, and states benefits of natural darkness. By using a personal story Bogard allows his audience to connect to him. If his audience can relate or even understand his story they will be more willing to agree with him. The personal story also shows that the issue of preserving natural darkness isn't just another topic to write about but something that he is actually passionate for. In his personal story Bogard uses great imagery making the audience picture what he saw and maybe make them want to experience it too. Bogard uses pathos by stating examples that appeal to people's emotions. In the article he wrote “Those of us over 35 are perhaps among the last generation to have known truly dark nights.” This statement appeals more to the younger generations emotion. By stating this people who are younger then 35 might feel that they were robbed of the oppurtunity to experience the real beauty of natural darkness. This would proably help his younger audience to agree with him because they might want the chance to see the real beauty of natural darkness.Bogard writes about the benefits that natural darkness actually produces. In the article he talks about how darkens actually helps the body produce a hormone that keeps certain cancers from developing. He also includes how darkness helps and is neccessary for certain animals. These examples will help his audience see that he is arguing for some benefical for people. This also helps appeal to an audience that might not care for the beauty of darkness but care for their own personal health. Bogard uses different features in order to persuade his audience. The different features also help him in appealing to a broader audience.

WHO YOU ARE
You a high school teacher and know that they need to be pushed to do their best. You are not afraid to give them harsh feedback, but you also know that you need to be encouraging and constructive. When in doubt, you score lower.

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
}`
}


export default router;
