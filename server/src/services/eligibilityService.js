export const checkStudentEligibility = (student, drive) => {
  const rules = drive.eligibilityRules || {};
  const reasons = [];

  // Check CGPA
  if (rules.minCGPA && (student.cgpa || 0) < rules.minCGPA) {
    reasons.push(`Minimum CGPA requirement is ${rules.minCGPA}, but student CGPA is ${student.cgpa || 0}`);
  }

  // Check Backlogs
  if (rules.maxBacklogs !== undefined && rules.maxBacklogs !== null) {
    if ((student.backlogs || 0) > rules.maxBacklogs) {
      reasons.push(
        `Maximum allowed backlogs is ${rules.maxBacklogs}, but student has ${student.backlogs || 0}`
      );
    }
  }

  // Check Department
  if (rules.allowedDepartments && rules.allowedDepartments.length > 0) {
    const allowedDeptIds = rules.allowedDepartments.map((d) => (d._id || d).toString());
    if (!student.departmentId || !allowedDeptIds.includes(student.departmentId.toString())) {
      reasons.push('Student department is not among the eligible departments for this drive.');
    }
  }

  // Check Course
  if (rules.allowedCourses && rules.allowedCourses.length > 0) {
    const allowedCourseIds = rules.allowedCourses.map((c) => (c._id || c).toString());
    if (!student.courseId || !allowedCourseIds.includes(student.courseId.toString())) {
      reasons.push('Student course is not among the eligible courses for this drive.');
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
};
