const jobRoles = require("../data/jobRoles");

function recommendRoles(resumeSkills) {

    const recommendations = [];
  
    const normalizedResumeSkills = resumeSkills.map(s =>
      s.toLowerCase().trim()
    );
  
    for (const role in jobRoles) {
  
      const requiredSkills = jobRoles[role].map(s =>
        s.toLowerCase().trim()
      );
  
      const matchedSkills = normalizedResumeSkills.filter(skill =>
        requiredSkills.includes(skill)
      );
  
      const score = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
      );
  
      recommendations.push({
        role,
        score
      });
  
    }
  
    recommendations.sort((a, b) => b.score - a.score);
  
    return recommendations.slice(0, 5);
  }
module.exports = { recommendRoles };