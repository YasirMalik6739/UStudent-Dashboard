import type { AttendanceRecord } from '../../types';
import { subjects } from './subjects';

// Deterministic illustrative session records; percentages are calculated from these records.
const attendanceCounts: Record<string, { conducted: number; attended: number; excused?: number }> = {
  cs501: { conducted: 24, attended: 22 },
  cs502: { conducted: 22, attended: 19 },
  cs503: { conducted: 23, attended: 18 },
  cs504: { conducted: 24, attended: 21 },
  cs505: { conducted: 22, attended: 21 },
  cs506: { conducted: 20, attended: 15, excused: 1 },
  cs507: { conducted: 24, attended: 16 },
  cs508: { conducted: 18, attended: 16 },
};
const isoDates = Array.from({ length: 24 }, (_, i) => {
  const d = new Date('2026-08-03T12:00:00');
  d.setDate(d.getDate() + i * 2);
  return d.toISOString().slice(0, 10);
});
export const attendanceRecords: AttendanceRecord[] = subjects.flatMap((subject, sIndex) => {
  const counts = attendanceCounts[subject.id];
  return Array.from({ length: counts.conducted }, (_, i) => {
    const status = i < counts.attended ? 'Present' : (i < counts.attended + (counts.excused ?? 0) ? 'Excused' : 'Absent');
    const dateIndex = (i + sIndex * 2) % isoDates.length;
    return {
      id: `${subject.id}-session-${i + 1}`,
      subjectId: subject.id,
      date: isoDates[dateIndex],
      period: `${(i % 5) + 1}${i % 5 === 0 ? 'st' : i % 5 === 1 ? 'nd' : i % 5 === 2 ? 'rd' : 'th'} Period`,
      faculty: subject.faculty,
      status,
      remarks: status === 'Excused' ? 'Approved academic activity' : undefined,
    };
  });
});
