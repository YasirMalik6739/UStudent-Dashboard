import type { SemesterResult, SubjectResult } from '../../types';
import { subjects } from './subjects';
import { appConfig } from '../../config/appConfig';

const priorSubjects = [
  { code: 'CS101', name: 'Programming Fundamentals', credits: 4 },
  { code: 'MA101', name: 'Engineering Mathematics I', credits: 4 },
  { code: 'PH101', name: 'Engineering Physics', credits: 3 },
  { code: 'EE101', name: 'Basic Electrical Engineering', credits: 3 },
  { code: 'HS101', name: 'Communication Skills', credits: 2 },
  { code: 'CS102L', name: 'Programming Lab', credits: 2 },
];
const priorMarks = [
  [88, 78, 83, 74, 91, 94],
  [82, 85, 79, 88, 86, 92],
  [90, 81, 77, 84, 93, 89],
  [86, 88, 90, 76, 84, 96],
];
const grading = (mark: number) => { const band = appConfig.grading.find(item => mark >= item.min) ?? appConfig.grading[appConfig.grading.length - 1]; return { grade: band.grade, points: band.points }; };
const calcSgpa = (rows: SubjectResult[], subjectCreditMap: Record<string, number>) => {
  const complete = rows.filter(r => r.gradePoint !== null);
  const credits = complete.reduce((sum, r) => sum + (subjectCreditMap[r.subjectId] ?? 0), 0);
  return credits ? Number((complete.reduce((sum, r) => sum + r.gradePoint! * (subjectCreditMap[r.subjectId] ?? 0), 0) / credits).toFixed(2)) : null;
};

const completed: SemesterResult[] = priorMarks.map((marks, index) => {
  const semester = index + 1;
  const resultRows: SubjectResult[] = priorSubjects.map((subject, subIndex) => {
    const key = `sem${semester}-${subject.code}`;
    const internal = Math.round(marks[subIndex] * 0.3);
    const external = marks[subIndex] - internal;
    const g = grading(marks[subIndex]);
    return { subjectId: key, internal, external, total: marks[subIndex], grade: g.grade, gradePoint: g.points, status: 'Published' };
  });
  const creditMap = Object.fromEntries(priorSubjects.map(s => [`sem${semester}-${s.code}`, s.credits]));
  return { id: `sem-${semester}`, semester, academicYear: semester <= 2 ? '2024–2025' : '2025–2026', status: 'Completed', publishedOn: `${2025 + (semester > 2 ? 1 : 0)}-${String(semester * 2).padStart(2, '0')}-18`, subjects: resultRows, earnedCredits: priorSubjects.reduce((a, s) => a + s.credits, 0), sgpa: calcSgpa(resultRows, creditMap) };
});
const currentResultRows: SubjectResult[] = subjects.map(subject => ({ subjectId: subject.id, internal: null, external: null, total: null, grade: null, gradePoint: null, status: 'Pending' }));
export const semesterResults: SemesterResult[] = [...completed, { id: 'sem-5', semester: 5, academicYear: '2026–2027', status: 'In Progress', subjects: currentResultRows, earnedCredits: 0, sgpa: null }];
export const resultSubjectsById: Record<string, { code: string; name: string; credits: number }> = {
  ...Object.fromEntries(priorSubjects.map(s => [`sem${1}-${s.code}`, s])),
  ...Object.fromEntries(priorSubjects.map(s => [`sem${2}-${s.code}`, s])),
  ...Object.fromEntries(priorSubjects.map(s => [`sem${3}-${s.code}`, s])),
  ...Object.fromEntries(priorSubjects.map(s => [`sem${4}-${s.code}`, s])),
  ...Object.fromEntries(subjects.map(s => [s.id, { code: s.code, name: s.name, credits: s.credits }])),
};
export const resultSubjectCatalog = priorSubjects;
