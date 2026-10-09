import type { Subject } from '../../types';
export const subjects: Subject[] = [
  { id: 'cs501', code: 'CS501', name: 'Design and Analysis of Algorithms', credits: 4, faculty: 'Dr. Nitin Verma', semester: 5, kind: 'Theory' },
  { id: 'cs502', code: 'CS502', name: 'Database Management Systems', credits: 4, faculty: 'Prof. Ritu Malhotra', semester: 5, kind: 'Theory' },
  { id: 'cs503', code: 'CS503', name: 'Operating Systems', credits: 4, faculty: 'Dr. Kabir Sethi', semester: 5, kind: 'Theory' },
  { id: 'cs504', code: 'CS504', name: 'Computer Networks', credits: 3, faculty: 'Prof. Sneha Rao', semester: 5, kind: 'Theory' },
  { id: 'cs505', code: 'CS505', name: 'Software Engineering', credits: 3, faculty: 'Dr. Vikram Joshi', semester: 5, kind: 'Theory' },
  { id: 'cs506', code: 'CS506', name: 'Programming Laboratory', credits: 2, faculty: 'Ms. Ananya Singh', semester: 5, kind: 'Lab' },
  { id: 'cs507', code: 'CS507', name: 'Introduction to Artificial Intelligence', credits: 3, faculty: 'Dr. Farhan Ali', semester: 5, kind: 'Theory' },
  { id: 'cs508', code: 'CS508', name: 'Algorithms Lab', credits: 1, faculty: 'Mr. Rahul Jain', semester: 5, kind: 'Lab' },
];
export const subjectsById = Object.fromEntries(subjects.map(s => [s.id, s])) as Record<string, Subject>;
