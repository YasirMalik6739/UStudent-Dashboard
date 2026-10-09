export type Student = {
  id: string; fullName: string; program: string; department: string; semester: number;
  academicYear: string; email: string; phone: string; joinedOn: string; advisor: string;
  institution: string; address: string; city: string; state: string; avatarUrl: string;
};
export type Subject = { id: string; code: string; name: string; credits: number; faculty: string; semester: number; kind: 'Theory' | 'Lab' };
export type AttendanceStatus = 'Present' | 'Absent' | 'Excused';
export type AttendanceRecord = { id: string; subjectId: string; date: string; period: string; faculty: string; status: AttendanceStatus; remarks?: string };
export type AttendanceSubjectSummary = { subject: Subject; conducted: number; attended: number; missed: number; excused: number; percentage: number };
export type AttendanceSummary = { conducted: number; attended: number; missed: number; excused: number; percentage: number; belowThreshold: number };
export type SubjectResult = { subjectId: string; internal: number | null; external: number | null; total: number | null; grade: string | null; gradePoint: number | null; status: 'Published' | 'Pending' };
export type SemesterResult = { id: string; semester: number; academicYear: string; status: 'Completed' | 'In Progress'; publishedOn?: string; subjects: SubjectResult[]; earnedCredits: number; sgpa: number | null };
export type EventCategory = 'Examination' | 'Assignment' | 'Academic Event' | 'Holiday' | 'Deadline' | 'Personal';
export type AcademicEvent = { id: string; title: string; start: string; end?: string; startTime?: string; endTime?: string; category: EventCategory; description: string; location?: string; allDay?: boolean };
export type StudentMessage = { id: string; folder: 'Inbox' | 'Sent'; sender: string; senderRole: string; subject: string; preview: string; body: string; timestamp: string; read: boolean; avatar: string };
export type PaymentTransaction = { id: string; description: string; date: string; amount: number; method: string; status: 'Successful' | 'Processing' | 'Failed'; receipt: string };
export type ApiResponse<T> = { data: T; message?: string };
export type ApiError = { message: string; status?: number; details?: unknown };
