const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.analyzeResume = async (resumeData) => {
  try {

    const prompt = `
You are an expert ATS resume reviewer.

Analyze this resume data and provide:
1. Resume score out of 100
2. Missing skills
3. Suggestions to improve

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return response in JSON format:
{
 "score": number,
 "missingSkills": [],
 "suggestions": []
}
`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert resume analyzer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error(error);
    throw new Error("AI analysis failed");
  }
};