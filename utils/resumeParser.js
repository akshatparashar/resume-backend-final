const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

/**
 * Parse resume file (PDF or DOCX)
 */
exports.parseResume = async (filePath, fileType) => {
  try {
    let text = '';

    if (fileType === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

/**
 * Extract structured data from resume text
 */
exports.extractResumeData = (text) => {
  const data = {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    certifications: extractCertifications(text),
  };

  return data;
};

// Helper functions for extraction
function extractName(text) {
  const lines = text.split('\n');
  // Assume name is in the first few lines
  return lines[0]?.trim() || 'Not found';
}

function extractEmail(text) {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
}

function extractSkills(text) {
  // Common tech skills
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'GraphQL', 'REST API', 'Microservices',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'Agile', 'Scrum', 'Jest', 'Testing', 'DevOps'
  ];

  const foundSkills = [];
  const lowerText = text.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)]; // Remove duplicates
}

function extractExperience(text) {
  // This is a simplified extraction
  // In production, you'd use more sophisticated NLP
  const experience = [];

  // Look for common job titles
  const jobTitles = [
    'Software Engineer', 'Developer', 'Programmer', 'Architect',
    'Manager', 'Lead', 'Senior', 'Junior', 'Intern',
    'Designer', 'Analyst', 'Consultant'
  ];

  const lines = text.split('\n');
  let currentJob = null;

  lines.forEach((line, index) => {
    jobTitles.forEach(title => {
      if (line.toLowerCase().includes(title.toLowerCase())) {
        if (currentJob) {
          experience.push(currentJob);
        }
        currentJob = {
          title: line.trim(),
          company: lines[index + 1]?.trim() || '',
          duration: '',
          description: ''
        };
      }
    });
  });

  if (currentJob) {
    experience.push(currentJob);
  }

  return experience.slice(0, 5); // Return top 5
}

function extractEducation(text) {
  const education = [];
  const degrees = ['Bachelor', 'Master', 'PhD', 'B.S.', 'M.S.', 'B.A.', 'M.A.', 'MBA'];

  const lines = text.split('\n');

  lines.forEach((line, index) => {
    degrees.forEach(degree => {
      if (line.includes(degree)) {
        education.push({
          degree: line.trim(),
          institution: lines[index + 1]?.trim() || '',
          year: extractYear(line) || extractYear(lines[index + 1] || '')
        });
      }
    });
  });

  return education;
}

function extractYear(text) {
  const yearRegex = /\b(19|20)\d{2}\b/g;
  const match = text.match(yearRegex);
  return match ? match[match.length - 1] : '';
}

function extractCertifications(text) {
  const certifications = [];
  const certKeywords = [
    'AWS Certified', 'Azure', 'Google Cloud', 'Certified',
    'PMP', 'Scrum Master', 'CompTIA', 'CISSP'
  ];

  const lines = text.split('\n');

  lines.forEach(line => {
    certKeywords.forEach(keyword => {
      if (line.includes(keyword)) {
        certifications.push(line.trim());
      }
    });
  });

  return [...new Set(certifications)];
}
