const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

exports.analyzeResume = async (resumeData) => {
  try {

    const prompt = `
Analyze the following resume and return JSON only with fields:
score, strengths, missingSkills, suggestions.

Resume:
${resumeData}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw error;
  }
};