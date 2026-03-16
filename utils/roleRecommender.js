const jobRoles = require("../data/jobRoles");

function recommendRoles(skills) {

  if (!skills || skills.length === 0) return [];

  const normalizedSkills = skills.map(s => s.toLowerCase().trim());

  const results = [];

  for (const roleName in jobRoles) {

    const roleSkills = jobRoles[roleName].map(s =>
      s.toLowerCase().trim()
    );

    let matchedCount = 0;

    for (const resumeSkill of normalizedSkills) {
      for (const roleSkill of roleSkills) {

        // fuzzy matching
        if (
          roleSkill.includes(resumeSkill) ||
          resumeSkill.includes(roleSkill)
        ) {
          matchedCount++;
          break;
        }

      }
    }

    const score = Math.round(
      (matchedCount / roleSkills.length) * 100
    );

    results.push({
      role: roleName,
      score
    });

  }

  return results
    .filter(r => r.score > 0) // remove useless 0 roles
    .sort((a, b) => b.score - a.score);

}

module.exports = { recommendRoles };