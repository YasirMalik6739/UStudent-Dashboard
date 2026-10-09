import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ClipboardCheck, Download, UserRound } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { attendanceService } from '../services';
import { appConfig } from '../config/appConfig';
import { Card, CardTitle } from '../components/ui/Card';
import { Badge, statusTone } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from 'sonner';
export function AttendanceDetailPage() {
  const { subjectId = '' } = useParams();
  const summary = attendanceService.getSubjectSummaries().find(s => s.subject.id === subjectId);
  const records = attendanceService.getBySubject(subjectId);
  const exportCsv = () => {
    const csv = [['Date', 'Session', 'Faculty', 'Status', 'Remarks'], ...records.map(r => [r.date, r.period, r.faculty, r.status, r.remarks ?? ''])].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a = document.createElement('a'); a.href = url; a.download = `${summary?.subject.code ?? 'subject'}-attendance.csv`; a.click(); URL.revokeObjectURL(url); toast.success('Subject history exported.');
  };
  if (!summary) return <Card><EmptyState icon={<ClipboardCheck size={22} />} title="Subject not found" description="This subject may not be part of the current demo semester." action={<Link to="/attendance"><Button icon={<ArrowLeft size={14} />}>Back to attendance</Button></Link>} /></Card>;
  const effectiveSessions = summary.conducted - summary.excused;
  return <><PageHeader title={summary.subject.name} subtitle={`${summary.subject.code} · Semester ${summary.subject.semester}`} actions={<><Link to="/attendance"><Button variant="outline" icon={<ArrowLeft size={14} />}>All attendance</Button></Link><Button icon={<Download size={14} />} onClick={exportCsv}>Export history</Button></>} />
    <div className="two-column"><Card><div className="flex items-center gap-3"><div className="stat-icon stat-purple"><ClipboardCheck size={22} /></div><div><p className="muted text-xs mb-1">Attendance percentage</p><p className="text-3xl font-semibold tracking-tight number">{summary.percentage}%</p><div className="progress-track mt-3" style={{ width: 180 }}><div className={`progress-fill ${summary.percentage < appConfig.attendanceThreshold ? 'fill-coral' : 'fill-purple'}`} style={{ width: `${summary.percentage}%` }} /></div></div></div><div className="mt-5"><Badge tone={statusTone(summary.percentage < 75 ? 'Below Requirement' : summary.percentage < 80 ? 'Needs Attention' : 'Good Standing')} dot>{summary.percentage < 75 ? 'Below Requirement' : summary.percentage < 80 ? 'Needs Attention' : 'Good Standing'}</Badge><p className="inline-note mt-3">The example attendance guideline is {appConfig.attendanceThreshold}%. Institutions can have different attendance policies.</p></div></Card><Card><CardTitle title="Subject details" /><div className="activity-list"><div className="activity-item"><div className="activity-dot"><UserRound size={16} /></div><div className="activity-copy"><strong>{summary.subject.faculty}</strong><small>Faculty member · sample record</small></div></div><div className="activity-item"><div className="activity-dot"><CalendarDays size={16} /></div><div className="activity-copy"><strong>{summary.subject.credits} credits · {summary.subject.kind}</strong><small>Semester {summary.subject.semester}</small></div></div></div></Card></div>
    <div className="stat-grid mt-4"><StatCard label="Total sessions" value={summary.conducted} hint="Including excused sessions" icon={<CalendarDays size={19} />} accent="blue" /><StatCard label="Attended" value={summary.attended} hint="Marked present" icon={<ClipboardCheck size={19} />} accent="green" /><StatCard label="Missed" value={summary.missed} hint="Marked absent" icon={<CalendarDays size={19} />} accent="coral" /><StatCard label="Eligible sessions" value={effectiveSessions} hint="Conducted minus excused" icon={<ClipboardCheck size={19} />} accent="purple" /></div>
    <Card className="mt-card"><CardTitle title="Date-wise attendance" subtitle="Most recent class sessions first" right={<span className="inline-note">{records.length} recorded sessions</span>} />{records.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Session</th><th>Faculty</th><th>Status</th><th>Remarks</th></tr></thead><tbody>{records.map(r => <tr key={r.id}><td>{format(parseISO(r.date), 'dd MMM yyyy')}</td><td>{r.period}</td><td>{r.faculty}</td><td><Badge tone={statusTone(r.status)} dot>{r.status}</Badge></td><td>{r.remarks ?? '—'}</td></tr>)}</tbody></table></div> : <EmptyState icon={<CalendarDays size={20} />} title="No sessions found" description="There are no recorded sessions for this subject in the selected demo semester." />}</Card>
  </>;
}
