const { analyzeJobMatchWithAI, isAIEnabled } = require('./aiService');

/**
 * Match resume with job description
 * Uses AI for enhanced insights when enabled
 */
exports.matchJobDescription = async (resumeData, jobDescription) => {
  const result = {
    matchScores: {
      overall: 0,
      skills: 0,
      experience: 0,
      keywords: 0,
    },
    matchedSkills: [],
    missingSkills: [],
    matchedKeywords: [],
    missingKeywords: [],
    recommendations: [],
  };

  // Extract skills and keywords from JD
  const jdSkills = extractSkillsFromJD(jobDescription);
  const jdKeywords = extractKeywordsFromJD(jobDescription);

  // Calculate skill match
  result.matchedSkills = resumeData.extractedData.skills.filter(skill =>
    jdSkills.some(jdSkill => skill.toLowerCase().includes(jdSkill.toLowerCase()))
  );

  result.missingSkills = jdSkills.filter(jdSkill =>
    !resumeData.extractedData.skills.some(skill => skill.toLowerCase().includes(jdSkill.toLowerCase()))
  );

  result.matchScores.skills = Math.round((result.matchedSkills.length / Math.max(jdSkills.length, 1)) * 100);

  // Calculate keyword match
  const resumeText = resumeData.parsedContent.toLowerCase();
  result.matchedKeywords = jdKeywords
    .filter(keyword => resumeText.includes(keyword.toLowerCase()))
    .map(keyword => ({
      keyword,
      count: (resumeText.match(new RegExp(keyword, 'gi')) || []).length,
    }));

  result.missingKeywords = jdKeywords.filter(
    keyword => !resumeText.includes(keyword.toLowerCase())
  );

  result.matchScores.keywords = Math.round((result.matchedKeywords.length / Math.max(jdKeywords.length, 1)) * 100);

  // Calculate experience match (simplified)
  result.matchScores.experience = calculateExperienceMatch(resumeData.extractedData, jobDescription);

  // Calculate overall match
  result.matchScores.overall = Math.round(
    (result.matchScores.skills * 0.4) +
    (result.matchScores.experience * 0.35) +
    (result.matchScores.keywords * 0.25)
  );

  // Generate recommendations
  result.recommendations = generateMatchRecommendations(result, resumeData);

  // Enhance with AI insights if enabled
  if (isAIEnabled()) {
    try {
      const aiInsights = await analyzeJobMatchWithAI(
        resumeData.parsedContent,
        jobDescription,
        result
      );

      if (aiInsights) {
        result.aiInsights = aiInsights;
        result.aiPowered = true;
      }
    } catch (error) {
      console.error('AI job match enhancement failed:', error.message);
    }
  }

  return result;
};

function extractSkillsFromJD(jd) {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'GraphQL', 'REST API', 'Microservices',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'Agile', 'Scrum', 'Jest', 'Testing', 'DevOps', 'Linux'
  ];

  const found = [];
  const lowerJD = jd.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerJD.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  });

  return [...new Set(found)];
}

function extractKeywordsFromJD(jd) {
  const keywords = [
    'leadership', 'team', 'collaboration', 'project management',
    'agile', 'scrum', 'communication', 'problem solving',
    'scalable', 'performance', 'optimization', 'architecture',
    'full stack', 'frontend', 'backend', 'devops',
    'cross-functional', 'microservices', 'cloud', 'deployment'
  ];

  const found = [];
  const lowerJD = jd.toLowerCase();

  keywords.forEach(keyword => {
    if (lowerJD.includes(keyword)) {
      found.push(keyword);
    }
  });

  return [...new Set(found)];
}

function calculateExperienceMatch(extractedData, jd) {
  // Look for experience requirements in JD
  const yearMatch = jd.match(/(\d+)\+?\s*years?/i);

  if (!yearMatch) {
    // If no specific years mentioned, check experience presence
    return extractedData.experience && extractedData.experience.length > 0 ? 85 : 60;
  }

  const requiredYears = parseInt(yearMatch[1]);
  const hasExperience = extractedData.experience && extractedData.experience.length > 0;

  // Simplified calculation based on number of roles
  if (hasExperience) {
    const roleCount = extractedData.experience.length;

    if (requiredYears <= 2 && roleCount >= 1) return 90;
    if (requiredYears <= 5 && roleCount >= 2) return 90;
    if (requiredYears > 5 && roleCount >= 3) return 85;

    return 75; // Has some experience
  }

  return 50; // No experience listed
}

function generateMatchRecommendations(matchResult, resumeData) {
  const recommendations = [];

  if (matchResult.matchScores.overall < 70) {
    recommendations.push('Your match score is below 70% - consider adding missing skills and keywords');
  }

  if (matchResult.missingSkills.length > 0) {
    recommendations.push(`Add these ${matchResult.missingSkills.length} missing skills: ${matchResult.missingSkills.slice(0, 3).join(', ')}`);
  }

  if (matchResult.missingKeywords.length > 0) {
    recommendations.push(`Incorporate these keywords: ${matchResult.missingKeywords.slice(0, 3).join(', ')}`);
  }

  if (matchResult.matchScores.skills < 70) {
    recommendations.push('Focus on learning the key technical skills mentioned in the job description');
  }

  if (matchResult.matchScores.keywords < 70) {
    recommendations.push('Tailor your resume by adding relevant keywords from the job description');
  }

  recommendations.push('Customize your professional summary to align with the job requirements');

  return recommendations.slice(0, 5);
}
