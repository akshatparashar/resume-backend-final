const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeResume = async (resumeData) => {
  try {

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"    });

    const prompt = `
You are an expert ATS resume reviewer.

Analyze the following resume data and provide:

1. Resume score out of 100
2. Missing skills
3. Suggestions for improvement

Return the response ONLY in JSON format like this:

{
 "score": number,
 "missingSkills": [],
 "suggestions": []
}

Resume Data:
${JSON.stringify(resumeData)}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    console.error(error);
    throw error;
  }
};