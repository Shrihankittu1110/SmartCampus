import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';
import {
  ROLES,
  ATTENDANCE_STATUS,
  APPLICATION_STATUS,
  REQUEST_TYPES,
  REQUEST_STATUS,
  NOTIFICATION_TYPES,
} from '../config/constants.js';

// Models
import Institution from '../models/Institution.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Enrollment from '../models/Enrollment.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Grade from '../models/Grade.js';
import Event from '../models/Event.js';
import StudentRequest from '../models/StudentRequest.js';
import Announcement from '../models/Announcement.js';
import Company from '../models/Company.js';
import JobDrive from '../models/JobDrive.js';
import PlacementApplication from '../models/PlacementApplication.js';
import InterviewStage from '../models/InterviewStage.js';
import PlacementOutcome from '../models/PlacementOutcome.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

export const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');
    await connectDB();

    // Clear existing collections
    await Promise.all([
      Institution.deleteMany({}),
      User.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Subject.deleteMany({}),
      Enrollment.deleteMany({}),
      Attendance.deleteMany({}),
      Assignment.deleteMany({}),
      AssignmentSubmission.deleteMany({}),
      Grade.deleteMany({}),
      Event.deleteMany({}),
      StudentRequest.deleteMany({}),
      Announcement.deleteMany({}),
      Company.deleteMany({}),
      JobDrive.deleteMany({}),
      PlacementApplication.deleteMany({}),
      InterviewStage.deleteMany({}),
      PlacementOutcome.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);
    logger.info('Purged existing records.');

    // 1. Create Super Admin
    const superAdmin = await User.create({
      name: 'Global Administrator',
      email: 'superadmin@campusflow.edu',
      password: 'Admin@123',
      role: ROLES.SUPER_ADMIN,
      phone: '+1 555-0100',
      isEmailVerified: true,
      isActive: true,
    });
    logger.info('Created Super Admin: superadmin@campusflow.edu');

    // 2. Create Institution
    const institution = await Institution.create({
      name: 'Anurag University',
      code: 'AU',
      email: 'info@anurag.edu.in',
      phone: '+91 8415 255309',
      address: 'Venkatapur, Ghatkesar, Medchal-Malkajgiri, Hyderabad, Telangana, India - 500088',
      website: 'https://anurag.edu.in',
      isActive: true,
      settings: {
        attendanceSafeThreshold: 75,
        attendanceWarningThreshold: 65,
        academicYear: '2025-2026',
        currentSemester: 4,
      },
    });
    logger.info('Created Institution: Anurag University');

    // 3. Create College Admin (Campus Admin)
    const collegeAdmin = await User.create({
      name: 'Dr. P. Rajeshwar Rao (Campus Admin)',
      email: 'admin@anurag.edu.in',
      password: 'Admin@123',
      role: ROLES.COLLEGE_ADMIN,
      institutionId: institution._id,
      employeeId: 'AU-ADM-01',
      phone: '+91 98490 12345',
      isEmailVerified: true,
      isActive: true,
    });

    // 4. Create Departments
    const cseDept = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      institutionId: institution._id,
      description: 'Department of Computer Science, Software Engineering & AI Systems',
    });

    const eceDept = await Department.create({
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
      institutionId: institution._id,
      description: 'Department of Electronics, Embedded Systems & Telecommunications',
    });

    const mechDept = await Department.create({
      name: 'Mechanical Engineering',
      code: 'MECH',
      institutionId: institution._id,
      description: 'Department of Mechanical Systems, Robotics & Thermal Engineering',
    });

    // 5. Create Faculty
    const faculty1 = await User.create({
      name: 'Dr. Alan Turing',
      email: 'faculty.cs@anurag.edu.in',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      institutionId: institution._id,
      departmentId: cseDept._id,
      employeeId: 'AU-FAC-CS01',
      phone: '+91 98111 22233',
      isEmailVerified: true,
      isActive: true,
    });

    const faculty2 = await User.create({
      name: 'Prof. Grace Hopper',
      email: 'faculty.hopper@anurag.edu.in',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      institutionId: institution._id,
      departmentId: cseDept._id,
      employeeId: 'AU-FAC-CS02',
      phone: '+91 98111 22244',
      isEmailVerified: true,
      isActive: true,
    });

    const faculty3 = await User.create({
      name: 'Dr. Claude Shannon',
      email: 'faculty.ec@anurag.edu.in',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      institutionId: institution._id,
      departmentId: eceDept._id,
      employeeId: 'AU-FAC-EC01',
      phone: '+91 98111 22255',
      isEmailVerified: true,
      isActive: true,
    });

    const faculty4 = await User.create({
      name: 'Dr. Nikola Tesla',
      email: 'faculty.mech@anurag.edu.in',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      institutionId: institution._id,
      departmentId: mechDept._id,
      employeeId: 'AU-FAC-ME01',
      phone: '+91 98111 22266',
      isEmailVerified: true,
      isActive: true,
    });

    cseDept.headOfDepartment = faculty1._id;
    await cseDept.save();

    // 6. Create Placement Officer
    const placementOfficer = await User.create({
      name: 'Marcus Brody (Dean Placements)',
      email: 'placement@anurag.edu.in',
      password: 'Placement@123',
      role: ROLES.PLACEMENT_OFFICER,
      institutionId: institution._id,
      employeeId: 'AU-TPO-01',
      phone: '+91 98999 88877',
      isEmailVerified: true,
      isActive: true,
    });

    // 7. Create Courses
    const btechCSE = await Course.create({
      name: 'B.Tech Computer Science & Engineering',
      code: 'BT-CSE',
      institutionId: institution._id,
      departmentId: cseDept._id,
      duration: 4,
      totalSemesters: 8,
      academicYear: '2025-2026',
    });

    const btechECE = await Course.create({
      name: 'B.Tech Electronics & Communication',
      code: 'BT-ECE',
      institutionId: institution._id,
      departmentId: eceDept._id,
      duration: 4,
      totalSemesters: 8,
      academicYear: '2025-2026',
    });

    const btechMech = await Course.create({
      name: 'B.Tech Mechanical Engineering',
      code: 'BT-MECH',
      institutionId: institution._id,
      departmentId: mechDept._id,
      duration: 4,
      totalSemesters: 8,
      academicYear: '2025-2026',
    });

    // 8. Create Subjects
    const subDbms = await Subject.create({
      name: 'Database Management Systems',
      code: 'CS401',
      courseId: btechCSE._id,
      departmentId: cseDept._id,
      institutionId: institution._id,
      facultyIds: [faculty1._id],
      credits: 4,
      semester: 4,
      syllabus: ['Relational Model', 'SQL', 'Normalization (1NF-BCNF)', 'Transactions & Concurrency', 'Indexing & Query Optimization'],
    });

    const subOS = await Subject.create({
      name: 'Operating Systems',
      code: 'CS402',
      courseId: btechCSE._id,
      departmentId: cseDept._id,
      institutionId: institution._id,
      facultyIds: [faculty2._id],
      credits: 4,
      semester: 4,
      syllabus: ['Processes & Threads', 'CPU Scheduling', 'Process Synchronization', 'Deadlocks', 'Virtual Memory'],
    });

    const subNetworks = await Subject.create({
      name: 'Computer Networks',
      code: 'CS403',
      courseId: btechCSE._id,
      departmentId: cseDept._id,
      institutionId: institution._id,
      facultyIds: [faculty1._id],
      credits: 3,
      semester: 4,
      syllabus: ['OSI Model', 'TCP/IP', 'Routing Algorithms', 'Transport Layer & Congestion Control', 'DNS & HTTP'],
    });

    const subDSP = await Subject.create({
      name: 'Digital Signal Processing',
      code: 'EC401',
      courseId: btechECE._id,
      departmentId: eceDept._id,
      institutionId: institution._id,
      facultyIds: [faculty3._id],
      credits: 4,
      semester: 4,
      syllabus: ['Discrete Fourier Transform', 'FFT Algorithms', 'IIR Filters', 'FIR Filter Design'],
    });

    // 9. Create Students with diverse academic profiles
    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'student1@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS001',
      currentSemester: 4,
      cgpa: 8.8,
      backlogs: 0,
      skills: ['Java', 'Python', 'React', 'MongoDB', 'Docker'],
      phone: '+91 99001 11001',
      isEmailVerified: true,
      isActive: true,
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'student2@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS002',
      currentSemester: 4,
      cgpa: 7.4,
      backlogs: 0,
      skills: ['C++', 'SQL', 'JavaScript', 'HTML/CSS'],
      phone: '+91 99001 11002',
      isEmailVerified: true,
      isActive: true,
    });

    const student3 = await User.create({
      name: 'Amit Kumar',
      email: 'student3@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS003',
      currentSemester: 4,
      cgpa: 5.9,
      backlogs: 2,
      skills: ['C', 'Python Basics'],
      phone: '+91 99001 11003',
      isEmailVerified: true,
      isActive: true,
    });

    const student4 = await User.create({
      name: 'Sneha Reddy',
      email: 'student4@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: eceDept._id,
      rollNumber: '23AUEC001',
      currentSemester: 4,
      cgpa: 9.3,
      backlogs: 0,
      skills: ['MATLAB', 'Verilog', 'Embedded C', 'Python', 'VLSI Design'],
      phone: '+91 99001 11004',
      isEmailVerified: true,
      isActive: true,
    });

    const student5 = await User.create({
      name: 'Vikram Singh',
      email: 'student5@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: mechDept._id,
      rollNumber: '23AUME001',
      currentSemester: 4,
      cgpa: 7.1,
      backlogs: 1,
      skills: ['AutoCAD', 'SolidWorks', 'ANSYS'],
      phone: '+91 99001 11005',
      isEmailVerified: true,
      isActive: true,
    });

    const student6 = await User.create({
      name: 'Ananya Roy',
      email: 'student6@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS004',
      currentSemester: 4,
      cgpa: 8.5,
      backlogs: 0,
      skills: ['Fullstack', 'Node.js', 'React', 'Kubernetes'],
      phone: '+91 99001 11006',
      isEmailVerified: true,
      isActive: true,
    });

    const student7 = await User.create({
      name: 'Karthik Varma',
      email: 'student7@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS005',
      currentSemester: 4,
      cgpa: 8.2,
      backlogs: 0,
      skills: ['Java', 'Spring Boot', 'SQL'],
      phone: '+91 99001 11007',
      isEmailVerified: true,
      isActive: true,
    });

    const student8 = await User.create({
      name: 'Divya Sri',
      email: 'student8@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS006',
      currentSemester: 4,
      cgpa: 8.9,
      backlogs: 0,
      skills: ['Python', 'Machine Learning', 'Data Structures'],
      phone: '+91 99001 11008',
      isEmailVerified: true,
      isActive: true,
    });

    const student9 = await User.create({
      name: 'Sai Teja',
      email: 'student9@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS007',
      currentSemester: 4,
      cgpa: 7.8,
      backlogs: 0,
      skills: ['Web Development', 'Tailwind', 'Next.js'],
      phone: '+91 99001 11009',
      isEmailVerified: true,
      isActive: true,
    });

    const student10 = await User.create({
      name: 'Meghana Rao',
      email: 'student10@anurag.edu.in',
      password: 'Student@123',
      role: ROLES.STUDENT,
      institutionId: institution._id,
      departmentId: cseDept._id,
      rollNumber: '23AUCS008',
      currentSemester: 4,
      cgpa: 9.1,
      backlogs: 0,
      skills: ['Cloud Computing', 'AWS', 'Python'],
      phone: '+91 99001 11010',
      isEmailVerified: true,
      isActive: true,
    });

    // 10. Create Enrollments
    const cseStudents = [student1, student2, student3, student6, student7, student8, student9, student10];
    for (const st of cseStudents) {
      await Enrollment.create({
        studentId: st._id,
        courseId: btechCSE._id,
        institutionId: institution._id,
        academicYear: '2025-2026',
        semester: 4,
      });
    }

    await Enrollment.create({
      studentId: student4._id,
      courseId: btechECE._id,
      institutionId: institution._id,
      academicYear: '2025-2026',
      semester: 4,
    });

    await Enrollment.create({
      studentId: student5._id,
      courseId: btechMech._id,
      institutionId: institution._id,
      academicYear: '2025-2026',
      semester: 4,
    });

    // 11. Create Realistic Attendance Records
    const pastDays = [1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 28];
    const now = new Date();

    for (const day of pastDays) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      date.setHours(0, 0, 0, 0);

      // Student 1: ~90% attendance (Safe)
      await Attendance.create({
        studentId: student1._id,
        subjectId: subDbms._id,
        courseId: btechCSE._id,
        facultyId: faculty1._id,
        institutionId: institution._id,
        date,
        status: day % 10 === 0 ? ATTENDANCE_STATUS.ABSENT : ATTENDANCE_STATUS.PRESENT,
      });

      // Student 2: ~70% attendance (Warning)
      await Attendance.create({
        studentId: student2._id,
        subjectId: subDbms._id,
        courseId: btechCSE._id,
        facultyId: faculty1._id,
        institutionId: institution._id,
        date,
        status: day % 3 === 0 ? ATTENDANCE_STATUS.ABSENT : ATTENDANCE_STATUS.PRESENT,
      });

      // Student 3: ~55% attendance (Critical)
      await Attendance.create({
        studentId: student3._id,
        subjectId: subDbms._id,
        courseId: btechCSE._id,
        facultyId: faculty1._id,
        institutionId: institution._id,
        date,
        status: day % 2 === 0 ? ATTENDANCE_STATUS.ABSENT : ATTENDANCE_STATUS.PRESENT,
      });

      // Student 4 (ECE)
      await Attendance.create({
        studentId: student4._id,
        subjectId: subDSP._id,
        courseId: btechECE._id,
        facultyId: faculty3._id,
        institutionId: institution._id,
        date,
        status: ATTENDANCE_STATUS.PRESENT,
      });
    }

    // 12. Create Assignments
    const assignment1 = await Assignment.create({
      title: 'DBMS Normalization & Relational Schema Design',
      description: 'Implement 1NF, 2NF, 3NF, and BCNF decompositions for the specified university schema problem set. Submit complete relational algebra queries and verification proofs.',
      subjectId: subDbms._id,
      facultyId: faculty1._id,
      institutionId: institution._id,
      departmentId: cseDept._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      maxMarks: 100,
      allowResubmission: true,
      status: 'PUBLISHED',
    });

    const assignment2 = await Assignment.create({
      title: 'OS Multithreading & Semaphore Synchronization',
      description: 'Build a POSIX thread-safe bounded buffer producer-consumer simulator using semaphores and mutex locks in C/C++.',
      subjectId: subOS._id,
      facultyId: faculty2._id,
      institutionId: institution._id,
      departmentId: cseDept._id,
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      maxMarks: 50,
      allowResubmission: true,
      status: 'PUBLISHED',
    });

    // 13. Submissions
    await AssignmentSubmission.create({
      assignmentId: assignment1._id,
      studentId: student1._id,
      institutionId: institution._id,
      file: { name: 'rahul_dbms_assign1.pdf', url: '/uploads/sample_rahul_dbms.pdf', size: 102400 },
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'GRADED',
      marks: 94,
      feedback: 'Outstanding schema normalization proofs. All dependencies correctly preserved.',
      gradedBy: faculty1._id,
      gradedAt: new Date(),
      version: 1,
    });

    await AssignmentSubmission.create({
      assignmentId: assignment1._id,
      studentId: student2._id,
      institutionId: institution._id,
      file: { name: 'priya_dbms_assign1.pdf', url: '/uploads/sample_priya_dbms.pdf', size: 85400 },
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'GRADED',
      marks: 72,
      feedback: 'Solid work. 3NF decomposition has minor redundancy issues in Relation 4.',
      gradedBy: faculty1._id,
      gradedAt: new Date(),
      version: 1,
    });

    await AssignmentSubmission.create({
      assignmentId: assignment1._id,
      studentId: student3._id,
      institutionId: institution._id,
      file: { name: 'amit_draft.pdf', url: '/uploads/sample_amit_dbms.pdf', size: 45000 },
      submittedAt: new Date(),
      status: 'RESUBMISSION_REQUESTED',
      feedback: 'Incomplete decomposition proof for Question 3. Please revise and resubmit.',
      gradedBy: faculty1._id,
      gradedAt: new Date(),
      version: 1,
    });

    // 14. Grades for previous semesters
    await Grade.create({
      studentId: student1._id,
      subjectId: subDbms._id,
      courseId: btechCSE._id,
      facultyId: faculty1._id,
      institutionId: institution._id,
      semester: 3,
      academicYear: '2024-2025',
      marks: 89,
      grade: 'A',
      gradePoint: 9,
      remarks: 'Excellent comprehension of fundamentals',
    });

    await Grade.create({
      studentId: student2._id,
      subjectId: subDbms._id,
      courseId: btechCSE._id,
      facultyId: faculty1._id,
      institutionId: institution._id,
      semester: 3,
      academicYear: '2024-2025',
      marks: 74,
      grade: 'B+',
      gradePoint: 7.5,
      remarks: 'Good performance',
    });

    await Grade.create({
      studentId: student3._id,
      subjectId: subDbms._id,
      courseId: btechCSE._id,
      facultyId: faculty1._id,
      institutionId: institution._id,
      semester: 3,
      academicYear: '2024-2025',
      marks: 54,
      grade: 'C',
      gradePoint: 5,
      remarks: 'Needs considerable improvement in query logic',
    });

    // 15. Events
    const event1 = await Event.create({
      title: 'National Tech Symposium: Frontiers of AI & Robotics 2026',
      description: 'Join industry luminaries and researchers for keynote sessions, technical paper presentations, and robotic showcase demos.',
      eventType: 'ACADEMIC',
      institutionId: institution._id,
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      location: 'Grand Auditorium, Tech Block B',
      organizer: 'Department of CSE & IEEE Student Branch',
      registrationRequired: true,
      maxParticipants: 300,
      attendees: [{ studentId: student1._id, registeredAt: new Date() }, { studentId: student4._id, registeredAt: new Date() }],
    });

    const event2 = await Event.create({
      title: 'Apex 36-Hour Hackathon: Code & Flow',
      description: 'Build groundbreaking fullstack SaaS and AI applications. Cash prizes worth 2,00,000 INR plus fast-track interview opportunities.',
      eventType: 'HACKATHON',
      institutionId: institution._id,
      startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      location: 'Apex Innovation Lab, Block C',
      organizer: 'Apex Placement & Innovation Cell',
      registrationRequired: true,
      maxParticipants: 120,
      attendees: [{ studentId: student1._id, registeredAt: new Date() }, { studentId: student6._id, registeredAt: new Date() }],
    });

    // 16. Student Requests
    await StudentRequest.create({
      studentId: student1._id,
      institutionId: institution._id,
      departmentId: cseDept._id,
      requestType: REQUEST_TYPES.BONAFIDE,
      subject: 'Bonafide Certificate for National Education Scholarship',
      description: 'Requesting official bonafide letter addressed to the state scholarship board verifying enrolled status.',
      status: REQUEST_STATUS.APPROVED,
      response: 'Bonafide certificate generated and digitally signed. You may download it from student documents.',
      assignedTo: collegeAdmin._id,
      resolvedAt: new Date(),
    });

    await StudentRequest.create({
      studentId: student3._id,
      institutionId: institution._id,
      departmentId: cseDept._id,
      requestType: REQUEST_TYPES.LEAVE,
      subject: 'Medical Leave Application (3 Days)',
      description: 'Suffering from acute viral fever. Doctor advised complete rest from 12th to 14th.',
      status: REQUEST_STATUS.PENDING,
      assignedTo: faculty1._id,
    });

    // 17. Announcements
    await Announcement.create({
      title: 'End-Semester Theory & Practical Examination Schedule',
      content: 'The official timetable for Semester 4 university examinations has been released. Download schedule from portal.',
      author: collegeAdmin._id,
      institutionId: institution._id,
      priority: 'HIGH',
      publishDate: new Date(),
    });

    await Announcement.create({
      title: 'Upcoming Google & Microsoft Campus Recruitment Drive',
      content: 'Mandatory pre-placement talk for eligible students (CGPA >= 7.5) on Thursday at 3 PM in Seminar Hall 1.',
      author: placementOfficer._id,
      institutionId: institution._id,
      priority: 'URGENT',
      publishDate: new Date(),
    });

    // 18. Companies & Job Drives
    const google = await Company.create({
      name: 'Google India Pvt Ltd',
      description: 'Global tech giant specializing in internet services, AI, cloud computing, and hardware.',
      website: 'https://careers.google.com',
      industry: 'Internet & Cloud Technology',
      location: 'Bangalore / Hyderabad',
      contactPerson: 'David Miller',
      contactEmail: 'campus.india@google.com',
      packageRange: '28 - 42 LPA',
      institutionId: institution._id,
      createdBy: placementOfficer._id,
    });

    const microsoft = await Company.create({
      name: 'Microsoft India Development Center',
      description: 'Global leader in enterprise cloud, developer tools, AI, and operating systems.',
      website: 'https://careers.microsoft.com',
      industry: 'Enterprise Software & Cloud',
      location: 'Hyderabad / Noida / Bangalore',
      contactPerson: 'Sarah Jenkins',
      contactEmail: 'university.idc@microsoft.com',
      packageRange: '22 - 38 LPA',
      institutionId: institution._id,
      createdBy: placementOfficer._id,
    });

    const infosys = await Company.create({
      name: 'Infosys Limited',
      description: 'Global leader in next-generation digital services and consulting.',
      website: 'https://www.infosys.com',
      industry: 'IT Consulting & Services',
      location: 'Bangalore / Pune / Chennai',
      contactPerson: 'Vikram Joshi',
      contactEmail: 'campus.connect@infosys.com',
      packageRange: '6 - 12 LPA',
      institutionId: institution._id,
      createdBy: placementOfficer._id,
    });

    // Job Drives
    const googleDrive = await JobDrive.create({
      companyId: google._id,
      title: 'Software Development Engineer I (SDE-1)',
      description: 'Design, develop, test, deploy, maintain, and enhance large-scale distributed cloud applications.',
      institutionId: institution._id,
      jobType: 'FULL_TIME',
      locations: ['Bangalore', 'Hyderabad'],
      package: { ctc: 32, currency: 'INR', breakdown: 'Base: 18LPA, Stocks: 10LPA, Sign-on: 4LPA' },
      openings: 8,
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      eligibilityRules: {
        minCGPA: 8.0,
        maxBacklogs: 0,
        allowedDepartments: [cseDept._id, eceDept._id],
        requiredSkills: ['Data Structures', 'Algorithms', 'System Design'],
      },
      status: 'PUBLISHED',
    });

    const msftDrive = await JobDrive.create({
      companyId: microsoft._id,
      title: 'Software Engineer - Azure Core',
      description: 'Build mission-critical distributed systems and cloud infrastructure powering Microsoft Azure.',
      institutionId: institution._id,
      jobType: 'FULL_TIME',
      locations: ['Hyderabad', 'Bangalore'],
      package: { ctc: 28, currency: 'INR', breakdown: 'Base: 16LPA, Performance: 4LPA, RSUs: 8LPA' },
      openings: 12,
      applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      eligibilityRules: {
        minCGPA: 7.5,
        maxBacklogs: 0,
        allowedDepartments: [cseDept._id, eceDept._id],
      },
      status: 'PUBLISHED',
    });

    const infosysDrive = await JobDrive.create({
      companyId: infosys._id,
      title: 'Specialist Programmer & Digital Specialist',
      description: 'Develop high-performance enterprise applications and modern cloud architectures.',
      institutionId: institution._id,
      jobType: 'FULL_TIME',
      locations: ['Bangalore', 'Pune', 'Hyderabad'],
      package: { ctc: 9.5, currency: 'INR', breakdown: 'Fixed: 8.5LPA, Bonus: 1LPA' },
      openings: 35,
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      eligibilityRules: {
        minCGPA: 6.0,
        maxBacklogs: 2,
        allowedDepartments: [cseDept._id, eceDept._id, mechDept._id],
      },
      status: 'PUBLISHED',
    });

    // 19. Placement Applications
    const appGoogleRahul = await PlacementApplication.create({
      jobDriveId: googleDrive._id,
      studentId: student1._id,
      institutionId: institution._id,
      status: APPLICATION_STATUS.SHORTLISTED,
      currentStage: 'Technical Coding Interview 1',
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      shortlistedAt: new Date(),
    });

    const appMsftSneha = await PlacementApplication.create({
      jobDriveId: msftDrive._id,
      studentId: student4._id,
      institutionId: institution._id,
      status: APPLICATION_STATUS.INTERVIEW,
      currentStage: 'System Architecture & Problem Solving',
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      shortlistedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    const appInfosysPriya = await PlacementApplication.create({
      jobDriveId: infosysDrive._id,
      studentId: student2._id,
      institutionId: institution._id,
      status: APPLICATION_STATUS.SELECTED,
      currentStage: 'Offer Released',
      finalResult: 'SELECTED',
      appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    });

    // 20. Interview Stage for Sneha
    await InterviewStage.create({
      applicationId: appMsftSneha._id,
      stageName: 'Online Coding Assessment',
      stageOrder: 1,
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      mode: 'ONLINE',
      locationOrLink: 'https://teams.microsoft.com/meeting-sample',
      result: 'PASSED',
      feedback: 'Scored 100% on both algorithmic problems. Optimal time complexity.',
    });

    await InterviewStage.create({
      applicationId: appMsftSneha._id,
      stageName: 'System Architecture & Problem Solving',
      stageOrder: 2,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      mode: 'ONLINE',
      locationOrLink: 'https://teams.microsoft.com/interview-stage2',
      result: 'PENDING',
    });

    // 21. Placement Outcome for Priya
    await PlacementOutcome.create({
      applicationId: appInfosysPriya._id,
      studentId: student2._id,
      companyId: infosys._id,
      jobDriveId: infosysDrive._id,
      institutionId: institution._id,
      package: 9.5,
      joiningDate: new Date('2026-07-15'),
      outcome: 'ACCEPTED',
      recordedBy: placementOfficer._id,
    });

    // 22. Seed Notifications
    await Notification.create({
      userId: student1._id,
      institutionId: institution._id,
      title: 'Shortlisted for Google SDE-1',
      message: 'Congratulations! Your profile has been shortlisted for the Google technical assessment round.',
      type: NOTIFICATION_TYPES.JOB_DRIVE,
      isRead: false,
    });

    await Notification.create({
      userId: student1._id,
      institutionId: institution._id,
      title: 'Assignment Graded: DBMS Normalization',
      message: 'Faculty Dr. Alan Turing graded your submission: 94/100.',
      type: NOTIFICATION_TYPES.ASSIGNMENT,
      isRead: true,
    });

    await Notification.create({
      userId: student2._id,
      institutionId: institution._id,
      title: 'Congratulations! Placement Offer from Infosys',
      message: 'You have been selected as Specialist Programmer with a package of 9.5 LPA!',
      type: NOTIFICATION_TYPES.PLACEMENT,
      isRead: false,
    });

    await Notification.create({
      userId: student3._id,
      institutionId: institution._id,
      title: 'Attendance Warning Alert',
      message: 'Your overall attendance in CS401 (DBMS) has dropped to 58%, which is below the mandatory 75% safe threshold.',
      type: NOTIFICATION_TYPES.ATTENDANCE_WARNING,
      isRead: false,
    });

    logger.info('Database seeding completed successfully for Anurag University!');
    logger.info('----------------------------------------------------');
    logger.info('Demo Credentials for Testing:');
    logger.info('1. Super Admin:       superadmin@campusflow.edu / Admin@123');
    logger.info('2. Campus Admin:       admin@anurag.edu.in       / Admin@123');
    logger.info('3. Faculty (CSE):      faculty.cs@anurag.edu.in  / Faculty@123');
    logger.info('4. Student (High CGPA):student1@anurag.edu.in    / Student@123');
    logger.info('5. Student (Warning):  student3@anurag.edu.in    / Student@123');
    logger.info('6. Placement Officer:  placement@anurag.edu.in   / Placement@123');
    logger.info('----------------------------------------------------');
  } catch (err) {
    logger.error('Error seeding database:', err.stack || err.message);
    throw err;
  }
};

// If run directly via node src/seed/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
