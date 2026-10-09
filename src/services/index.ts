import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import type { AcademicEvent, AttendanceRecord, AttendanceSubjectSummary, AttendanceSummary, PaymentTransaction, SemesterResult, Student, StudentMessage } from '../types';
import { appConfig } from '../config/appConfig';
import { demoStudent } from '../data/demo/student';
import { subjects } from '../data/demo/subjects';
import { attendanceRecords } from '../data/demo/attendance';
import { semesterResults, resultSubjectsById } from '../data/demo/results';
import { baseCalendarEvents } from '../data/demo/calendarEvents';
import { demoMessages } from '../data/demo/messages';
import { demoPayments } from '../data/demo/payments';

const readStore = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }
  catch { return fallback; }
};
const writeStore = <T,>(key: string, value: T) => { localStorage.setItem(key, JSON.stringify(value)); if (typeof window !== 'undefined') window.dispatchEvent(new Event('ustudent-data-updated')); };
const calculateRecordSummary = (records: AttendanceRecord[]) => {
  const conducted = records.length;
  const attended = records.filter(r => r.status === 'Present').length;
  const excused = records.filter(r => r.status === 'Excused').length;
  const missed = records.filter(r => r.status === 'Absent').length;
  const denominator = conducted - excused;
  return { conducted, attended, missed, excused, percentage: denominator ? Math.round(attended / denominator * 1000) / 10 : 0 };
};

export const studentService = {
  getProfile: (): Student => readStore('ustudent-profile', demoStudent),
  updateProfile: (profile: Student): Student => { writeStore('ustudent-profile', profile); return profile; },
};
export const attendanceService = {
  getRecords: (semesterId = 'sem-5'): AttendanceRecord[] => semesterId === 'sem-5' ? attendanceRecords : [],
  getBySubject: (subjectId: string): AttendanceRecord[] => attendanceRecords.filter(r => r.subjectId === subjectId).sort((a, b) => b.date.localeCompare(a.date)),
  getSubjectSummaries: (): AttendanceSubjectSummary[] => subjects.map(subject => {
    const records = attendanceRecords.filter(r => r.subjectId === subject.id);
    return { subject, ...calculateRecordSummary(records) };
  }),
  getSummary: (): AttendanceSummary => {
    const summary = calculateRecordSummary(attendanceRecords);
    const belowThreshold = attendanceService.getSubjectSummaries().filter(s => s.percentage < appConfig.attendanceThreshold).length;
    return { ...summary, belowThreshold };
  },
  getTrend: (period: 'This Month' | 'Last Month' | 'This Semester') => {
    const summaries = attendanceService.getSubjectSummaries();
    const mult = period === 'This Month' ? 1 : period === 'Last Month' ? -1 : 0;
    return summaries.map((s, i) => ({ subject: s.subject.name, short: ['DAA', 'DBMS', 'OS', 'CN', 'SE', 'Lab', 'AI', 'Algo Lab'][i], attendance: Math.max(0, Math.min(100, Math.round(s.percentage + mult * ((i % 3) - 1) * 3 + (period === 'This Semester' ? 1 : 0)))) }));
  },
};
export const resultsService = {
  getSemesters: (): SemesterResult[] => semesterResults,
  getBySemester: (semesterId: string): SemesterResult | undefined => semesterResults.find(s => s.id === semesterId),
  getSubjectInfo: (subjectId: string) => resultSubjectsById[subjectId],
  getCgpa: (): number => {
    const complete = semesterResults.filter(s => s.status === 'Completed');
    let totalPoints = 0; let totalCredits = 0;
    for (const sem of complete) for (const result of sem.subjects) {
      const info = resultSubjectsById[result.subjectId];
      if (info && result.gradePoint !== null) { totalPoints += result.gradePoint * info.credits; totalCredits += info.credits; }
    }
    return totalCredits ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
  },
  getCompletedCredits: (): number => semesterResults.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.earnedCredits, 0),
};
export const calendarService = {
  getEvents: (from?: Date, to?: Date): AcademicEvent[] => {
    const events = readStore<AcademicEvent[]>('ustudent-calendar-events', baseCalendarEvents);
    if (!from || !to) return events;
    return events.filter(event => {
      const start = parseISO(event.start);
      const end = event.end ? parseISO(event.end) : start;
      return start <= to && end >= from;
    });
  },
  getMonthEvents: (date: Date): AcademicEvent[] => calendarService.getEvents(startOfMonth(date), endOfMonth(date)),
  createEvent: (event: Omit<AcademicEvent, 'id'>): AcademicEvent => {
    const current = readStore<AcademicEvent[]>('ustudent-calendar-events', baseCalendarEvents);
    const created = { ...event, id: `custom-${Date.now()}` };
    writeStore('ustudent-calendar-events', [...current, created]);
    return created;
  },
};
export const messageService = {
  getAll: (): StudentMessage[] => readStore('ustudent-messages', demoMessages).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  getInbox: (): StudentMessage[] => messageService.getAll().filter(m => m.folder === 'Inbox'),
  getUnreadCount: (): number => messageService.getInbox().filter(m => !m.read).length,
  markAsRead: (messageId: string): StudentMessage[] => {
    const updated = messageService.getAll().map(m => m.id === messageId ? { ...m, read: true } : m);
    writeStore('ustudent-messages', updated); return updated;
  },
  send: (message: Pick<StudentMessage, 'subject' | 'body'>): StudentMessage[] => {
    const updated = [{ id: `sent-${Date.now()}`, folder: 'Sent' as const, sender: studentService.getProfile().fullName, senderRole: 'Student', subject: message.subject, preview: message.body.slice(0, 92), body: message.body, timestamp: new Date().toISOString(), read: true, avatar: 'AS' }, ...messageService.getAll()];
    writeStore('ustudent-messages', updated); return updated;
  },
};
export const paymentService = { getTransactions: (): PaymentTransaction[] => demoPayments };

export type SearchResult = { title: string; type: string; detail: string; path: string };
export const searchService = {
  search: (query: string): SearchResult[] => {
    const q = query.trim().toLowerCase(); if (!q) return [];
    const resultList: SearchResult[] = [];
    const profile = studentService.getProfile();
    if ([profile.fullName, profile.id, profile.email, profile.program].some(v => v.toLowerCase().includes(q))) resultList.push({ title: profile.fullName, type: 'Profile', detail: `${profile.id} · ${profile.program}`, path: '/profile' });
    subjects.forEach(s => { if (`${s.name} ${s.code} ${s.faculty}`.toLowerCase().includes(q)) resultList.push({ title: s.name, type: 'Subject', detail: `${s.code} · ${s.faculty}`, path: '/attendance' }); });
    calendarService.getEvents().forEach(e => { if (`${e.title} ${e.category} ${e.description}`.toLowerCase().includes(q)) resultList.push({ title: e.title, type: 'Calendar', detail: `${format(parseISO(e.start), 'd MMM yyyy')} · ${e.category}`, path: '/calendar' }); });
    messageService.getAll().forEach(m => { if (`${m.subject} ${m.sender} ${m.preview}`.toLowerCase().includes(q)) resultList.push({ title: m.subject, type: 'Message', detail: `${m.sender} · ${format(parseISO(m.timestamp), 'd MMM')}`, path: '/messages' }); });
    demoPayments.forEach(p => { if (`${p.id} ${p.description} ${p.receipt}`.toLowerCase().includes(q)) resultList.push({ title: p.description, type: 'Payment', detail: `${p.id} · ₹${p.amount.toLocaleString('en-IN')}`, path: '/payments' }); });
    return resultList.slice(0, 8);
  },
};
export const dashboardService = {
  getOverview: () => ({ student: studentService.getProfile(), attendance: attendanceService.getSummary(), subjectSummaries: attendanceService.getSubjectSummaries(), semesters: resultsService.getSemesters(), cgpa: resultsService.getCgpa(), credits: resultsService.getCompletedCredits(), upcomingEvents: calendarService.getEvents().filter(e => e.start >= format(new Date(), 'yyyy-MM-dd')).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 5), messages: messageService.getAll().filter(m => m.folder === 'Inbox').slice(0, 3), unreadCount: messageService.getUnreadCount() }),
};
