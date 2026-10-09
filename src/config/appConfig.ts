export const appConfig = {
  name: 'UStudent',
  attendanceThreshold: 75,
  grading: [
    { min: 90, grade: 'O', points: 10 },
    { min: 80, grade: 'A+', points: 9 },
    { min: 70, grade: 'A', points: 8 },
    { min: 60, grade: 'B+', points: 7 },
    { min: 50, grade: 'B', points: 6 },
    { min: 40, grade: 'C', points: 5 },
    { min: 0, grade: 'F', points: 0 },
  ],
  demoCredentials: { studentId: 'STU-2026-1042', password: 'Student@123' },
  dataMode: import.meta.env.VITE_DATA_MODE ?? 'demo',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
} as const;
