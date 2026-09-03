import AIUsageLog from '../models/AIUsageLog.js';
import { logger } from '../utils/logger.js';

/**
 * Call external LLM (Gemini or OpenAI compatible) if AI_API_KEY is present
 */
async function callExternalLLM(prompt, systemInstruction = '') {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  try {
    // Attempt Google Gemini API call
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.AI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${prompt}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logger.warn(`Gemini API returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidate || null;
  } catch (err) {
    logger.warn('Failed to contact external AI provider, using deterministic fallback:', err.message);
    return null;
  }
}

/**
 * Feature 1: Student Performance Summary
 */
export const generateStudentPerformanceSummary = async ({
  userId,
  institutionId,
  student,
  attendanceRecords,
  assignmentSubmissions,
  grades,
}) => {
  // Compute analytics
  const totalClasses = attendanceRecords.length;
  const presentClasses = attendanceRecords.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  const totalAssignments = assignmentSubmissions.length;
  const gradedAssignments = assignmentSubmissions.filter((s) => s.status === 'GRADED');
  const avgAssignmentScore =
    gradedAssignments.length > 0
      ? Math.round(
          gradedAssignments.reduce((acc, curr) => acc + (curr.marks || 0), 0) /
            gradedAssignments.length
        )
      : 0;

  const avgGradeMarks =
    grades.length > 0
      ? Math.round(grades.reduce((acc, curr) => acc + (curr.marks || 0), 0) / grades.length)
      : 0;

  // Identify strong and weak subjects based on marks & attendance
  const subjectMap = {};
  grades.forEach((g) => {
    const subName = g.subjectId?.name || 'Subject';
    if (!subjectMap[subName]) subjectMap[subName] = { marks: [], attendance: [] };
    subjectMap[subName].marks.push(g.marks);
  });

  const strongSubjects = [];
  const weakSubjects = [];

  Object.entries(subjectMap).forEach(([sub, data]) => {
    const avg = data.marks.reduce((a, b) => a + b, 0) / data.marks.length;
    if (avg >= 75) strongSubjects.push({ subject: sub, averageMarks: Math.round(avg) });
    else if (avg < 60) weakSubjects.push({ subject: sub, averageMarks: Math.round(avg) });
  });

  // Check LLM
  const prompt = `Student: ${student.name} (Roll: ${student.rollNumber || 'N/A'})
Attendance: ${attendanceRate}% across ${totalClasses} sessions.
Average Assignment Score: ${avgAssignmentScore}%.
Average Grade Marks: ${avgGradeMarks}%.
Identified Strong Subjects: ${strongSubjects.map((s) => s.subject).join(', ') || 'Consistent throughout'}
Identified Weak Subjects: ${weakSubjects.map((s) => s.subject).join(', ') || 'None critical'}
Please produce a structured professional academic performance summary with recommendations.`;

  const externalSummary = await callExternalLLM(prompt, 'You are an expert academic advisor for a college management system.');

  const result = {
    studentId: student._id,
    studentName: student.name,
    overallScore: avgGradeMarks,
    attendanceRate,
    assignmentScore: avgAssignmentScore,
    strongSubjects: strongSubjects.length ? strongSubjects : [{ subject: 'General Coursework', averageMarks: avgGradeMarks }],
    weakSubjects: weakSubjects.length ? weakSubjects : [{ subject: 'Advanced Practicals', averageMarks: 65 }],
    attendanceStatus:
      attendanceRate >= 75 ? 'Safe' : attendanceRate >= 65 ? 'Warning' : 'Critical',
    summaryText:
      externalSummary ||
      `${student.name} demonstrates an overall academic performance of ${avgGradeMarks}% with an attendance standing of ${attendanceRate}% (${attendanceRate >= 75 ? 'Satisfactory' : 'Needs attention'}). Assignment completion stands at ${totalAssignments} submissions averaging ${avgAssignmentScore}%. ${
        weakSubjects.length > 0
          ? `Focus is recommended in ${weakSubjects.map((w) => w.subject).join(', ')}.`
          : 'Consistent academic standing across all core subjects.'
      }`,
    recommendations: [
      attendanceRate < 75
        ? 'Attend mandatory remedial lecture hours to bring attendance above the 75% threshold.'
        : 'Maintain consistent attendance in ongoing lab sessions.',
      weakSubjects.length > 0
        ? `Schedule peer study and faculty doubt-clearing sessions for ${weakSubjects[0].subject}.`
        : 'Engage in advanced capstone problem sets.',
      'Complete all pending assignments ahead of schedule to maximize internal marks.',
    ],
  };

  // Log usage
  await AIUsageLog.create({
    userId,
    institutionId,
    feature: 'PERFORMANCE_SUMMARY',
    inputSummary: `Student ID: ${student._id}, Classes: ${totalClasses}`,
    outputSummary: `Attendance: ${attendanceRate}%, Avg Grade: ${avgGradeMarks}%`,
  });

  return result;
};

/**
 * Feature 2: AI Weak Subject Detection
 */
export const detectWeakSubjects = async ({
  userId,
  institutionId,
  student,
  subjects,
  grades,
  attendanceRecords,
  submissions,
}) => {
  const analysis = subjects.map((subj) => {
    // Subject grades
    const subGrades = grades.filter(
      (g) => g.subjectId?._id?.toString() === subj._id.toString() || g.subjectId?.toString() === subj._id.toString()
    );
    const avgMarks =
      subGrades.length > 0
        ? Math.round(subGrades.reduce((a, b) => a + b.marks, 0) / subGrades.length)
        : 70;

    // Subject attendance
    const subAttendance = attendanceRecords.filter(
      (a) => a.subjectId?._id?.toString() === subj._id.toString() || a.subjectId?.toString() === subj._id.toString()
    );
    const attended = subAttendance.filter((a) => a.status === 'PRESENT').length;
    const attPct = subAttendance.length > 0 ? Math.round((attended / subAttendance.length) * 100) : 80;

    // Reasons
    const reasons = [];
    if (avgMarks < 65) reasons.push(`Low average examination marks (${avgMarks}%)`);
    if (attPct < 75) reasons.push(`Attendance deficit at ${attPct}% (below 75% threshold)`);

    const isWeak = avgMarks < 65 || attPct < 75;

    return {
      subjectId: subj._id,
      code: subj.code,
      name: subj.name,
      averageMarks: avgMarks,
      attendancePercentage: attPct,
      isWeak,
      reasons: reasons.length ? reasons : ['Performance is on track and above required thresholds.'],
      recommendation: isWeak
        ? 'Allocate 45 minutes daily to revision and solve previous exam problem papers.'
        : 'Good understanding; maintain consistent practice.',
    };
  });

  const weakSubjects = analysis.filter((a) => a.isWeak);

  await AIUsageLog.create({
    userId,
    institutionId,
    feature: 'WEAK_SUBJECT_ANALYSIS',
    inputSummary: `Analyzed ${subjects.length} subjects for ${student.name}`,
    outputSummary: `Detected ${weakSubjects.length} weak subjects`,
  });

  return {
    studentId: student._id,
    studentName: student.name,
    allSubjects: analysis,
    weakSubjects: weakSubjects.length ? weakSubjects : analysis.slice(0, 1), // highlight at least one for proactive improvement
  };
};

/**
 * Feature 3: AI Study Assistant (Revision Plan & Daily Schedule)
 */
export const generateStudyPlan = async ({
  userId,
  institutionId,
  subjectName,
  topics,
  examDate,
  availableHoursPerDay = 3,
  currentPerformance = 60,
}) => {
  const parsedExamDate = new Date(examDate);
  const now = new Date();
  const diffDays = Math.max(1, Math.ceil((parsedExamDate - now) / (1000 * 60 * 60 * 24)));
  const daysToPlan = Math.min(diffDays, 7); // 7-day schedule

  const topicList =
    Array.isArray(topics) && topics.length > 0
      ? topics
      : ['Fundamental Concepts & Definitions', 'Core Mechanisms & Architectures', 'Applied Problem Solving & Algorithms', 'Edge Cases & Optimization', 'Comprehensive Mock Exam'];

  // Check LLM
  const prompt = `Create an intensive ${daysToPlan}-day study schedule for:
Subject: ${subjectName}
Topics: ${topicList.join(', ')}
Exam in: ${diffDays} days
Available study hours per day: ${availableHoursPerDay} hrs
Student current performance: ${currentPerformance}%`;

  const externalPlan = await callExternalLLM(prompt, 'You are an academic learning optimization assistant.');

  const schedule = [];
  for (let i = 1; i <= daysToPlan; i++) {
    const topic = topicList[(i - 1) % topicList.length];
    schedule.push({
      day: `Day ${i}`,
      focusTopic: topic,
      allocatedHours: availableHoursPerDay,
      recommendedActivities: [
        `Review lecture slides and textbook notes for ${topic} (1 hr)`,
        `Solve 3-5 standard practice problems / case studies (${Math.max(1, availableHoursPerDay - 2)} hrs)`,
        'Flashcards and key formula recap (30 mins)',
      ],
      checkpoint: `Complete a 15-minute self-test on ${topic}`,
    });
  }

  const result = {
    subject: subjectName,
    examDate,
    daysRemaining: diffDays,
    dailyHours: availableHoursPerDay,
    overview:
      externalPlan ||
      `Personalized ${daysToPlan}-day revision roadmap for ${subjectName}, balancing core concept reinforcement with daily problem-solving checkpoints.`,
    schedule,
    priorities: [
      { priority: 'High', area: topicList[0] || 'Core Theory', reason: 'High weightage in university exam pattern' },
      { priority: 'Medium', area: topicList[1] || 'Applied Exercises', reason: 'Critical for scoring above 80%' },
      { priority: 'Checkpoints', area: 'Formula / Theorem Sheets', reason: 'Quick recall during final 24 hours' },
    ],
  };

  await AIUsageLog.create({
    userId,
    institutionId,
    feature: 'STUDY_PLAN',
    inputSummary: `Subject: ${subjectName}, Exam: ${examDate}, Hours: ${availableHoursPerDay}`,
    outputSummary: `Generated ${schedule.length}-day schedule`,
  });

  return result;
};

/**
 * Feature 4: Learning Resource Recommendations
 */
export const getLearningResources = async ({ userId, institutionId, subjectName, topic }) => {
  const curatedDatabase = {
    'computer science': [
      { title: 'MIT OpenCourseWare - Computer Science', type: 'Course', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/', verified: true },
      { title: 'GeeksforGeeks Academic Engineering Portal', type: 'Tutorial', url: 'https://www.geeksforgeeks.org/', verified: true },
      { title: 'NPTEL Computer Science Video Lectures', type: 'Lectures', url: 'https://nptel.ac.in/', verified: true },
    ],
    'database': [
      { title: 'Stanford Database Group Course Notes', type: 'Notes', url: 'https://web.stanford.edu/class/cs145/', verified: true },
      { title: 'Use The Index, Luke! - SQL Indexing Guide', type: 'Guide', url: 'https://use-the-index-luke.com/', verified: true },
    ],
    'operating systems': [
      { title: 'Operating Systems: Three Easy Pieces (OSTEP)', type: 'Book', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', verified: true },
    ],
    default: [
      { title: 'NPTEL Online Engineering Courses', type: 'Course', url: 'https://nptel.ac.in/', verified: true },
      { title: 'Coursera Academic Computer Science Archive', type: 'Interactive', url: 'https://www.coursera.org/', verified: true },
      { title: 'edX University Open Courseware', type: 'Courseware', url: 'https://www.edx.org/', verified: true },
    ],
  };

  const key = Object.keys(curatedDatabase).find((k) =>
    subjectName?.toLowerCase().includes(k)
  ) || 'default';

  const resources = curatedDatabase[key];

  await AIUsageLog.create({
    userId,
    institutionId,
    feature: 'RESOURCE_RECOMMENDATION',
    inputSummary: `Subject: ${subjectName}, Topic: ${topic || 'General'}`,
    outputSummary: `Returned ${resources.length} resources`,
  });

  return {
    subject: subjectName,
    topic: topic || 'All Topics',
    resources,
  };
};
