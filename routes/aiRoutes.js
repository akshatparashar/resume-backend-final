const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  try {

    const { resumeText, skills, targetRole, experienceLevel } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume text is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are an ATS resume analyzer.

Analyze the following resume.

Target Role: ${targetRole}
Experience Level: ${experienceLevel}

Resume Text:
${resumeText}

Skills:
${skills}

Provide analysis in this format:

Strengths:
- ...

Weaknesses:
- ...

Missing Skills:
- ...

ATS Improvements:
- ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      analysis: text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "AI analysis failed"
    });

  }
});

router.post("/suggestions", async (req, res) => {
    try {
  
      const { resumeText, skills } = req.body;
  
      if (!resumeText) {
        return res.status(400).json({
          message: "Resume text is required"
        });
      }
  
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });
  
      const prompt = `
  You are an expert ATS resume reviewer.
  
  Analyze this resume and provide clear improvement suggestions.
  
  Resume:
  ${resumeText}
  
  Skills:
  ${skills}
  
  Give 5 bullet point suggestions to improve this resume.
  `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      const suggestions = text
        .split("\n")
        .filter(line => line.trim() !== "");
  
      res.json({
        suggestions
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "AI suggestions generation failed"
      });
  
    }
  });

module.exports = router;