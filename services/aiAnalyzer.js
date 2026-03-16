const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeResume = async (resumeData) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const prompt = `
Analyze the following resume and return JSON only with fields:
score, strengths, missingSkills, suggestions.

Resume:
${resumeData}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);



  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    console.error(error);
    throw error;
  }
};