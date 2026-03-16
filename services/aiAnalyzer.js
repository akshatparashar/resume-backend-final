const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.analyzeResume = async (resumeData) => {
  try {

    const prompt = `
You are an expert ATS resume reviewer.

Analyze the resume and return:

1. Resume score out of 100
2. Missing skills
3. Suggestions

Resume Data:
${JSON.stringify(resumeData)}

Return JSON only.
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: prompt
    });

    return response.output_text;

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    throw new Error("AI analysis failed");
  }
};