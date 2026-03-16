const jobRoles = require("../data/jobRoles");

function recommendRoles(skills) {

  if (!skills || skills.length === 0) {
    return [];
  }

  // normalize resume skills
  const normalizedSkills = skills.map(skill =>
    skill.toLowerCase().trim()
  );

  const results = [];

  for (const role of jobRoles) {

    const roleSkills = role.skills.map(skill =>
      skill.toLowerCase().trim()
    );

    const matched = normalizedSkills.filter(skill =>
      roleSkills.includes(skill)
    );

    const score = Math.round(
      (matched.length / roleSkills.length) * 100
    );

    results.push({
      role: role.role,
      score: score
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

module.exports = { recommendRoles };