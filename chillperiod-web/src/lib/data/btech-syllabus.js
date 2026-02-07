export const semesters = [
  { value: "1", label: "1st Semester" },
  { value: "2", label: "2nd Semester" },
  { value: "3", label: "3rd Semester" },
  { value: "4", label: "4th Semester" },
  { value: "5", label: "5th Semester" },
  { value: "6", label: "6th Semester" },
  { value: "7", label: "7th Semester" },
  { value: "8", label: "8th Semester" },
];

export const branches = [
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "IT", label: "Information Technology" },
  { value: "ECE", label: "Electronics & Communication" },
  { value: "CSE-AI", label: "CSE (Artificial Intelligence)" },
  { value: "CSE-DS", label: "CSE (Data Science)" },
  { value: "EEE", label: "Electrical & Electronics" },
  { value: "MAE", label: "Mechanical & Automation" },
  { value: "CE", label: "Civil Engineering" },
];

export const syllabusPdfs = {
  "CSE": "http://www.ipu.ac.in/syllabus/btech2025/Annexure%20-%206a%20--%20USS%20CSE%20-%202025.pdf",
  "IT": "http://www.ipu.ac.in/syllabus/btech2025/Annexure%20-%206b%20--%20USS%20IT%20-%202025.pdf",
  "ECE": "http://www.ipu.ac.in/syllabus/btech2025/Annexure%20-%206c%20--%20USS%20ECE%20-%202025.pdf",
  "CSE-AI": "http://www.ipu.ac.in/syllabus/btech2025/Annexure%20-%206d%20--%20USS%20-%20CSE%20-%20AI%20-%202025.pdf",
  "CSE-DS": "http://www.ipu.ac.in/syllabus/Annexure%20-%206e%20--%20USS%20CSE%20-%20DS%20-%202025.pdf",
};

// Key format: "{semester}_{branch}"
export const syllabusData = {
  // Keeping existing manual data as fallback/hybrid
  "1_CSE": [
    { name: "Applied Mathematics-I", code: "BS-101", credits: 4 },
    { name: "Applied Physics-I", code: "BS-103", credits: 3 },
    { name: "Manufacturing Processes", code: "ES-105", credits: 3 },
    { name: "Electrical Technology", code: "ES-107", credits: 3 },
    { name: "Human Values & Professional Ethics", code: "HS-109", credits: 1 },
    { name: "Fundamentals of Computing", code: "ES-111", credits: 2 },
    { name: "Applied Chemistry", code: "BS-113", credits: 3 },
  ],
  "4_CSE": [
    { name: "Database Management System", code: "CIC-210", credits: 4 },
    { name: "Theory of Computation", code: "CIC-206", credits: 4 },
    { name: "Technical Writing", code: "HS-204", credits: 3 },
    { name: "Operating Systems", code: "CIC-204", credits: 4 },
    { name: "Computer Graphics", code: "CIC-208", credits: 4 },
    { name: "Communication Systems", code: "ECE-212", credits: 4 },
  ],
};

export const getSubjects = (semester, branch) => {
  const key = `${semester}_${branch}`;
  return syllabusData[key] || [];
};

export const getPdfLink = (branch) => {
  return syllabusPdfs[branch] || null;
};
