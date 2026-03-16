const jobRoles = require("../data/jobRoles");

function recommendRoles(skills) {

  if (!skills || skills.length === 0) return [];

  const normalizedSkills = skills.map(skill =>
    skill.toLowerCase().trim()
  );

  const results = [];

  for (const roleName in jobRoles) {

    const roleSkills = jobRoles[roleName].map(skill =>
      skill.toLowerCase().trim()
    );

    const matched = normalizedSkills.filter(skill =>
      roleSkills.includes(skill)
    );

    const score = Math.round(
      (matched.length / roleSkills.length) * 100
    );

    results.push({
      role: roleName,
      score: score
    });

  }

  return results.sort((a, b) => b.score - a.score);
}

module.exports = { recommendRoles };