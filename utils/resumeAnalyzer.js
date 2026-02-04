const { analyzeResumeWithAI, isAIEnabled } = require('./aiService');

/**
 * Analyze resume and generate scores
 * Uses AI if enabled, falls back to rule-based analysis
 */
exports.analyzeResume = async (extractedData, parsedContent, targetRole, experienceLevel) => {
  // Try AI-powered analysis first
  if (isAIEnabled()) {
    try {
      const aiAnalysis = await analyzeResumeWithAI(parsedContent, extractedData, targetRole);

      if (aiAnalysis) {
        // Merge AI analysis with rule-based scores
        const ruleBasedScores = {
          atsScore: calculateATSScore(parsedContent, extractedData),
          resumeScore: calculateResumeScore(extractedData),
          skillMatch: calculateSkillMatch(extractedData.skills, targetRole),
        };

        return {
          scores: {
            resumeScore: aiAnalysis.resumeScore?.score || ruleBasedScores.resumeScore,
            atsScore: aiAnalysis.atsScore?.score || ruleBasedScores.atsScore,
            skillMatch: ruleBasedScores.skillMatch, // Keep rule-based for consistency
          },
          strengths: aiAnalysis.strengths || [],
          weaknesses: aiAnalysis.weaknesses || [],
          missingSkills: aiAnalysis.missingSkills || [],
          recommendations: aiAnalysis.recommendations || [],
          keywords: extractKeywords(parsedContent),
          aiPowered: true,
        };
      }
    } catch (error) {
      console.error('AI analysis failed, falling back to rule-based:', error.message);
    }
  }

  // Fall back to rule-based analysis
  const analysis = {
    scores: {
      resumeScore: 0,
      atsScore: 0,
      skillMatch: 0,
    },
    strengths: [],
    weaknesses: [],
    missingSkills: [],
    recommendations: [],
    keywords: [],
    aiPowered: false,
  };

  // Calculate ATS Score
  analysis.scores.atsScore = calculateATSScore(parsedContent, extractedData);

  // Calculate Resume Score
  analysis.scores.resumeScore = calculateResumeScore(extractedData);

  // Calculate Skill Match
  analysis.scores.skillMatch = calculateSkillMatch(extractedData.skills, targetRole);

  // Analyze strengths
  analysis.strengths = identifyStrengths(extractedData);

  // Analyze weaknesses
  analysis.weaknesses = identifyWeaknesses(extractedData);

  // Identify missing skills
  analysis.missingSkills = identifyMissingSkills(extractedData.skills, targetRole);

  // Generate recommendations
  analysis.recommendations = generateRecommendations(extractedData, targetRole);

  // Extract keywords
  analysis.keywords = extractKeywords(parsedContent);

  return analysis;
};

function calculateATSScore(content, data) {
  let score = 60; // Base score

  // Check for contact information
  if (data.email) score += 5;
  if (data.phone) score += 5;

  // Check for skills section
  if (data.skills && data.skills.length > 0) {
    score += Math.min(data.skills.length * 2, 20);
  }

  // Check for experience
  if (data.experience && data.experience.length > 0) {
    score += 10;
  }

  // Check for education
  if (data.education && data.education.length > 0) {
    score += 5;
  }

  // Avoid common ATS issues
  if (!content.includes('|') && !content.includes('→')) {
    score += 5; // No special characters
  }

  return Math.min(score, 100);
}

function calculateResumeScore(data) {
  let score = 50; // Base score

  // Skills
  if (data.skills && data.skills.length >= 8) score += 15;
  else if (data.skills && data.skills.length >= 5) score += 10;

  // Experience
  if (data.experience && data.experience.length >= 3) score += 15;
  else if (data.experience && data.experience.length >= 1) score += 10;

  // Education
  if (data.education && data.education.length > 0) score += 10;

  // Certifications
  if (data.certifications && data.certifications.length > 0) score += 10;

  // Contact info
  if (data.email && data.phone) score += 10;

  return Math.min(score, 100);
}

function calculateSkillMatch(skills, targetRole) {
  const roleSkillsMap = {
    'software-engineer': ['JavaScript', 'Python', 'Java', 'Git', 'SQL', 'Data Structures', 'Algorithms'],
    'frontend-developer': ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Next.js', 'Vue'],
    'backend-developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST API', 'GraphQL'],
    'fullstack-developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'HTML', 'CSS', 'Git'],
    'devops-engineer': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Git', 'Python'],
    'data-scientist': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Data Science'],
    'data-analyst': ['SQL', 'Python', 'Excel', 'Tableau', 'Data Visualization'],
  };

  const requiredSkills = roleSkillsMap[targetRole] || [];
  if (requiredSkills.length === 0) return 75; // Default if role not found

  const matchedSkills = skills.filter(skill =>
    requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
  );

  const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;
  return Math.round(Math.min(matchPercentage, 100));
}

function identifyStrengths(data) {
  const strengths = [];

  if (data.skills && data.skills.length >= 8) {
    strengths.push('Strong technical skills - Multiple technologies listed');
  }

  if (data.experience && data.experience.length >= 3) {
    strengths.push('Diverse work experience across multiple roles');
  }

  if (data.certifications && data.certifications.length > 0) {
    strengths.push('Professional certifications demonstrate commitment to growth');
  }

  if (data.email && data.phone) {
    strengths.push('Complete contact information for easy reach');
  }

  return strengths;
}

function identifyWeaknesses(data) {
  const weaknesses = [];

  if (!data.skills || data.skills.length < 5) {
    weaknesses.push('Limited technical skills listed - add more relevant technologies');
  }

  if (!data.certifications || data.certifications.length === 0) {
    weaknesses.push('No certifications listed - consider adding relevant credentials');
  }

  if (!data.experience || data.experience.length < 2) {
    weaknesses.push('Limited work experience shown - elaborate on projects and responsibilities');
  }

  return weaknesses;
}

function identifyMissingSkills(currentSkills, targetRole) {
  const roleSkillsMap = {
    'software-engineer': ['GraphQL', 'Docker', 'Kubernetes', 'Testing', 'System Design'],
    'frontend-developer': ['Next.js', 'TypeScript', 'State Management', 'Testing', 'Performance Optimization'],
    'backend-developer': ['GraphQL', 'Microservices', 'Redis', 'Message Queues', 'Kubernetes'],
    'fullstack-developer': ['GraphQL', 'Next.js', 'Docker', 'Redis', 'Testing'],
    'devops-engineer': ['Terraform', 'Ansible', 'Prometheus', 'Grafana', 'ELK Stack'],
    'data-scientist': ['Deep Learning', 'NLP', 'Computer Vision', 'Big Data', 'Spark'],
  };

  const recommendedSkills = roleSkillsMap[targetRole] || [];

  const missing = recommendedSkills.filter(skill =>
    !currentSkills.some(current => current.toLowerCase().includes(skill.toLowerCase()))
  );

  return missing.slice(0, 6); // Return top 6
}

function generateRecommendations(data, targetRole) {
  const recommendations = [
    'Add quantifiable achievements with metrics and numbers',
    'Use action verbs to start bullet points (Developed, Implemented, Optimized)',
    'Tailor your resume to match the job description keywords',
    'Keep resume length to 1-2 pages maximum',
    'Include links to GitHub, portfolio, or LinkedIn',
  ];

  if (!data.certifications || data.certifications.length === 0) {
    recommendations.push('Consider obtaining relevant certifications for your target role');
  }

  if (data.skills && data.skills.length < 8) {
    recommendations.push('Expand your skills section with more relevant technologies');
  }

  return recommendations.slice(0, 6);
}

function extractKeywords(content) {
  const commonKeywords = [
    'leadership', 'team', 'project', 'development', 'design',
    'implementation', 'optimization', 'scalable', 'agile', 'collaboration'
  ];

  const found = [];
  const lowerContent = content.toLowerCase();

  commonKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      found.push(keyword);
    }
  });

  return found;
}
