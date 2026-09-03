const escapeCSV = (field) => {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
};

export const generateAttendanceCSV = (records) => {
  const headers = [
    'Date',
    'Student Name',
    'Roll Number',
    'Subject Code',
    'Subject Name',
    'Status',
    'Remarks',
  ];

  const rows = records.map((rec) => [
    rec.date ? new Date(rec.date).toISOString().split('T')[0] : '',
    rec.studentId?.name || 'N/A',
    rec.studentId?.rollNumber || 'N/A',
    rec.subjectId?.code || 'N/A',
    rec.subjectId?.name || 'N/A',
    rec.status,
    rec.remarks || '',
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csvContent;
};

export const generateStudentsCSV = (students) => {
  const headers = [
    'Name',
    'Email',
    'Roll Number',
    'Department',
    'Semester',
    'CGPA',
    'Backlogs',
    'Status',
  ];

  const rows = students.map((s) => [
    s.name,
    s.email,
    s.rollNumber || '',
    s.departmentId?.name || 'N/A',
    s.currentSemester || 1,
    s.cgpa || 0,
    s.backlogs || 0,
    s.isActive ? 'Active' : 'Inactive',
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csvContent;
};

export const generatePlacementCSV = (applications) => {
  const headers = [
    'Student Name',
    'Roll Number',
    'Department',
    'Company',
    'Job Title',
    'Applied At',
    'Status',
    'Current Stage',
    'Final Result',
  ];

  const rows = applications.map((app) => [
    app.studentId?.name || 'N/A',
    app.studentId?.rollNumber || 'N/A',
    app.studentId?.departmentId?.name || 'N/A',
    app.jobDriveId?.companyId?.name || 'N/A',
    app.jobDriveId?.title || 'N/A',
    app.appliedAt ? new Date(app.appliedAt).toISOString().split('T')[0] : '',
    app.status,
    app.currentStage,
    app.finalResult,
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csvContent;
};
