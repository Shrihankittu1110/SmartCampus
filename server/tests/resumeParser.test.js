import { extractEntities, matchResumeWithDrive } from '../src/services/resumeParserService.js';

describe('AI Resume Parser & ATS Matcher Service', () => {
  const sampleResumeText = `
    Alex Johnson
    alex.johnson@email.com | (555) 123-4567 | linkedin.com/in/alexjohnson | github.com/alexj
    
    Summary:
    Results-driven Software Engineer with expertise in modern full-stack web applications.
    
    Education:
    Bachelor of Technology in Computer Science & Engineering
    Anurag University, Hyderabad (CGPA: 8.9)
    
    Technical Skills:
    Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
    Frameworks & Libraries: React, Node.js, Express, Next.js, Tailwind CSS
    Databases & Tools: MongoDB, PostgreSQL, Redis, Git, Docker, REST APIs
    Concepts: Data Structures, Algorithms, OOP, Agile Development
    
    Experience & Projects:
    Full Stack Developer Intern — TechCorp
    - Built a real-time collaborative dashboard using React, Node.js, and MongoDB.
    - Optimized API queries and reduced database response time by 35%.
    - Implemented secure JWT authentication and deployed containerized services using Docker.
    - Engineered automated CI/CD pipelines accelerating deployment cycles for 500+ active users.
  `;

  const mockJobDrive = {
    title: 'Full Stack Software Engineer',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Docker', 'AWS'],
    description: 'We are hiring a full stack developer proficient in React and Node.js.',
  };

  test('extractEntities correctly identifies technical skills, contacts, and verbs', () => {
    const entities = extractEntities(sampleResumeText);

    expect(entities.technicalSkills).toContain('JavaScript');
    expect(entities.technicalSkills).toContain('React');
    expect(entities.technicalSkills).toContain('Node.js');
    expect(entities.technicalSkills).toContain('MongoDB');
    expect(entities.technicalSkills).toContain('Docker');

    expect(entities.contacts.hasEmail).toBe(true);
    expect(entities.contacts.hasPhone).toBe(true);
    expect(entities.contacts.hasLinkedIn).toBe(true);
    expect(entities.contacts.hasGitHub).toBe(true);

    expect(entities.sections.hasEducation).toBe(true);
    expect(entities.sections.hasSkills).toBe(true);
    expect(entities.sections.hasProjects || entities.sections.hasExperience).toBe(true);

    expect(entities.metricsCount).toBeGreaterThanOrEqual(1);
    expect(entities.actionVerbs.length).toBeGreaterThanOrEqual(3);
  });

  test('matchResumeWithDrive generates realistic ATS score and skill breakdown', () => {
    const entities = extractEntities(sampleResumeText);
    const result = matchResumeWithDrive({
      resumeEntities: entities,
      rawText: sampleResumeText,
      jobDrive: mockJobDrive,
    });

    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.matchedSkills).toContain('JavaScript');
    expect(result.matchedSkills).toContain('React');
    expect(result.matchedSkills).toContain('Node.js');
    expect(result.matchedSkills).toContain('MongoDB');
    expect(result.matchedSkills).toContain('Docker');

    expect(result.missingSkills).toContain('AWS');
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0]).toMatch(/AWS/);
  });
});
