import { PDFParse } from 'pdf-parse';
import { logger } from '../utils/logger.js';

// Comprehensive technical skill taxonomy
const TECH_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'React.js', 'Next.js', 'Node.js', 'Express', 'Express.js',
  'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring', 'Spring Boot', 'C', 'C++', 'C#',
  '.NET', 'Go', 'Golang', 'Rust', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Kotlin', 'Swift',
  'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind', 'Tailwind CSS', 'Bootstrap', 'Sass',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra',
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services',
  'Azure', 'GCP', 'Google Cloud', 'Linux', 'Unix', 'Bash', 'CI/CD', 'Jenkins',
  'GraphQL', 'REST', 'RESTful API', 'Microservices', 'System Design', 'OOP',
  'Data Structures', 'Algorithms', 'Machine Learning', 'Deep Learning', 'NLP',
  'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Tableau', 'Power BI'
];

const SOFT_SKILLS = [
  'Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Critical Thinking',
  'Agile', 'Scrum', 'Time Management', 'Collaboration', 'Adaptability', 'Mentoring'
];

const ACTION_VERBS = [
  'built', 'developed', 'engineered', 'designed', 'implemented', 'deployed',
  'optimized', 'refactored', 'architected', 'integrated', 'spearheaded',
  'automated', 'reduced', 'increased', 'scaled', 'accelerated', 'launched'
];

/**
 * Extract text from uploaded buffer (PDF or TXT)
 */
export const extractResumeText = async (buffer, mimetype = 'application/pdf') => {
  try {
    if (mimetype === 'application/pdf' || mimetype.includes('pdf')) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = typeof result === 'string' ? result : result?.text || '';
      return text.trim();
    }
    return buffer.toString('utf8').trim();
  } catch (err) {
    logger.warn(`PDF extraction fallback to raw text: ${err.message}`);
    return buffer.toString('utf8').trim();
  }
};

/**
 * Detect skills, education, sections, and metrics from resume text
 */
export const extractEntities = (rawText) => {
  const lowerText = rawText.toLowerCase();

  // 1. Detect technical skills
  const detectedTech = [];
  TECH_SKILLS.forEach((skill) => {
    // Word boundary regex
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedTech.push(skill);
    }
  });

  // 2. Detect soft skills
  const detectedSoft = [];
  SOFT_SKILLS.forEach((skill) => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedSoft.push(skill);
    }
  });

  // 3. Detect action verbs used
  const detectedVerbs = [];
  ACTION_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedVerbs.push(verb);
    }
  });

  // 4. Detect contact info
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawText);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(rawText);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(rawText) || lowerText.includes('linkedin');
  const hasGitHub = /github\.com\/[a-zA-Z0-9_-]+/i.test(rawText) || lowerText.includes('github');

  // 5. Detect major sections
  const hasEducation = /education|academic|bachelor|b\.tech|b\.e|mca|university|college/i.test(lowerText);
  const hasExperience = /experience|employment|work history|projects|internship/i.test(lowerText);
  const hasProjects = /projects|technical projects|personal projects/i.test(lowerText);
  const hasSkills = /skills|technical proficiency|technologies/i.test(lowerText);

  // 6. Detect quantifiable metrics (e.g. 20%, $5k, 100+ users)
  const metricMatches = rawText.match(/\d+%(?:\s+increase|\s+reduction)?|\d+\+\s+(?:users|clients|requests)|\$\d+/gi) || [];

  return {
    technicalSkills: [...new Set(detectedTech)],
    softSkills: [...new Set(detectedSoft)],
    actionVerbs: [...new Set(detectedVerbs)],
    metricsCount: metricMatches.length,
    contacts: { hasEmail, hasPhone, hasLinkedIn, hasGitHub },
    sections: { hasEducation, hasExperience, hasProjects, hasSkills },
    wordCount: rawText.split(/\s+/).filter(Boolean).length,
  };
};

/**
 * Compare resume against Job Drive requirements and compute ATS compatibility
 */
export const matchResumeWithDrive = ({ resumeEntities, rawText, jobDrive }) => {
  const driveSkills = (jobDrive?.requiredSkills || []).map((s) => s.trim());
  const driveTitle = jobDrive?.title || 'Software Engineer';
  const driveDesc = (jobDrive?.description || '').toLowerCase();

  // Find matching skills
  const resumeSkillsLower = resumeEntities.technicalSkills.map((s) => s.toLowerCase());
  const matchedSkills = [];
  const missingSkills = [];

  driveSkills.forEach((skill) => {
    const isMatch = resumeSkillsLower.some(
      (rs) => rs === skill.toLowerCase() || rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs)
    );
    if (isMatch) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Scoring weights:
  // 1. Skill Match: up to 50 points
  const skillRatio = driveSkills.length > 0 ? matchedSkills.length / driveSkills.length : 0.75;
  const skillScore = Math.round(skillRatio * 50);

  // 2. Sections & Structure: up to 25 points
  let structureScore = 0;
  if (resumeEntities.sections.hasEducation) structureScore += 5;
  if (resumeEntities.sections.hasSkills) structureScore += 5;
  if (resumeEntities.sections.hasProjects || resumeEntities.sections.hasExperience) structureScore += 8;
  if (resumeEntities.contacts.hasEmail && resumeEntities.contacts.hasPhone) structureScore += 4;
  if (resumeEntities.contacts.hasLinkedIn || resumeEntities.contacts.hasGitHub) structureScore += 3;

  // 3. Impact & Phrasing: up to 25 points
  let impactScore = 0;
  if (resumeEntities.actionVerbs.length >= 5) impactScore += 10;
  else impactScore += resumeEntities.actionVerbs.length * 2;

  if (resumeEntities.metricsCount >= 2) impactScore += 8;
  else if (resumeEntities.metricsCount === 1) impactScore += 4;

  if (resumeEntities.wordCount >= 200 && resumeEntities.wordCount <= 800) impactScore += 7;
  else if (resumeEntities.wordCount > 100) impactScore += 4;

  const totalScore = Math.min(100, Math.max(30, skillScore + structureScore + impactScore));

  // Qualitative Rating
  let rating = 'Needs Work';
  let badgeColor = 'amber';
  if (totalScore >= 80) {
    rating = 'Strong Match';
    badgeColor = 'emerald';
  } else if (totalScore >= 65) {
    rating = 'Good Match';
    badgeColor = 'cyan';
  } else if (totalScore >= 50) {
    rating = 'Fair Match';
    badgeColor = 'indigo';
  }

  // Generate Actionable Recommendations
  const recommendations = [];
  if (missingSkills.length > 0) {
    recommendations.push(
      `Add key missing technologies required for this role: ${missingSkills.slice(0, 5).join(', ')}.`
    );
  }

  if (!resumeEntities.contacts.hasGitHub && !resumeEntities.contacts.hasLinkedIn) {
    recommendations.push('Include clickable links to your active GitHub profile and LinkedIn.');
  }

  if (resumeEntities.metricsCount === 0) {
    recommendations.push(
      'Quantify your accomplishments using metrics (e.g., "reduced latency by 35%", "built for 200+ users").'
    );
  }

  if (resumeEntities.actionVerbs.length < 4) {
    recommendations.push(
      'Begin bullet points with powerful action verbs such as "Engineered", "Architected", "Spearheaded", or "Automated".'
    );
  }

  if (resumeEntities.wordCount < 250) {
    recommendations.push('Expand your project descriptions with technologies used, architecture decisions, and challenges solved.');
  }

  return {
    score: totalScore,
    rating,
    badgeColor,
    matchedSkills,
    missingSkills,
    detectedSkills: resumeEntities.technicalSkills,
    softSkills: resumeEntities.softSkills,
    breakdown: {
      skillScore,
      structureScore,
      impactScore,
    },
    recommendations,
    stats: {
      wordCount: resumeEntities.wordCount,
      metricsFound: resumeEntities.metricsCount,
      actionVerbsCount: resumeEntities.actionVerbs.length,
    },
  };
};
