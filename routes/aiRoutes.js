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

      model: "llama3-70b-8192"

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
  You are an ATS resume expert.
  
  Analyze this resume:
  
  ${resumeText}
  
  Skills:
  ${skills}
  
  Return ONLY 5 resume improvement suggestions.
  
  Rules:
  - One sentence per suggestion
  - No explanation
  - No headings
  `;
  
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      });
  
      const text = completion.choices[0].message.content;
  
      const suggestions = text
        .split("\n")
        .map(line => line.replace(/^[-•\d.\s]+/, "").trim())
        .filter(line => line.length > 10)
        .slice(0,5);
  
      res.json({ suggestions });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "AI suggestions failed"
      });
  
    }
  
  });
module.exports = router;