import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

export async function callOpenAI(prompt, rubric) {
    console.log("Calling OpenAI");
    prompt = prompt.replace(/\n/g, '');
    rubric = rubric.replace(/\n/g, '');
    rubric = JSON.stringify(rubric);

    console.log("Sending prompt and rubric to OpenAI");

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 2000,
            prompt: prompt + rubric,
            temperature: 0.6,
        });

        console.log("Server: 200 ok, show data");
        console.log(completion.data);
        console.log("end data");

        return completion.data.choices[0].text;
    } catch (error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw new Error('An error occurred during the request');
    }
}
