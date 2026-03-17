const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/*
AI Resume Analyzer
*/
router.post("/analyze", async (req, res) => {

  try {

    const { resumeText, skills, targetRole, experienceLevel } = req.body;

    const prompt = `
You are an ATS resume analyzer.

Analyze the resume below.

Target Role: ${targetRole}
Experience Level: ${experienceLevel}

Resume:
${resumeText}

Skills:
${skills}

Return analysis in this format:

Strengths:
- ...

Weaknesses:
- ...

Missing Skills:
- ...

ATS Improvements:
- ...
`;

    const completion = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      model: "llama-3.1-8b-instant"
    });

    const analysis = completion.choices[0].message.content;

    res.json({ analysis });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "AI analysis failed"
    });

  }

});


/*
AI Suggestions
*/
router.post("/suggestions", async (req, res) => {

    try {
  
      const { resumeText, skills } = req.body;
  
      const prompt = `
  You are an ATS resume analyzer.
  
  Analyze this resume:
  
  ${resumeText}
  
  Skills:
  ${skills}
  
  Return JSON only.
  
  {
   "strengths": ["", "", ""],
   "weaknesses": ["", "", ""],
   "missingSkills": ["", "", ""],
   "suggestions": ["", "", "", "", ""]
  }
  
  Rules:
  - Only JSON
  - No explanations
  `;
  
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      });
  
      const text = completion.choices[0].message.content;
  
      let aiResult;
  
      try {
  
        aiResult = JSON.parse(text);
  
      } catch (err) {
  
        const cleaned = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
  
        aiResult = JSON.parse(cleaned);
  
      }
  
      res.json(aiResult);
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "AI analysis failed"
      });
  
    }
  
  });
module.exports = router;