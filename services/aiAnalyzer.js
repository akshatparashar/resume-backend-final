const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

exports.analyzeResume = async (resumeData) => {
  try {

    // TEMPORARY MOCK AI RESPONSE
    return {
      score: 82,
      strengths: [
        "Strong JavaScript knowledge",
        "Good frontend development skills",
        "Experience with React and Node.js"
      ],
      missingSkills: [
        "Docker",
        "AWS",
        "System Design"
      ],
      suggestions: [
        "Add measurable achievements in projects",
        "Include more backend technologies",
        "Improve project descriptions"
      ]
    };

  } catch (error) {
    console.error(error);
    throw error;
  }
};
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
