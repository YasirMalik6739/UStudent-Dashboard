import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, GraduationCap, Mail, Medal, NotebookText, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dashboardService, attendanceService, resultsService } from '../services';
import { Card, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { format, parseISO } from 'date-fns';

const accentSeries = ['#6842d9', '#f7836b', '#9454f5', '#5397ef', '#25b981', '#d4a640', '#5f70d8', '#df6ab4'];
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload?: { subject?: string; short?: string } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><p>{payload[0]?.payload?.subject ?? label}</p><span>Attendance: <strong>{payload[0]?.value}%</strong></span></div>;
}
export function DashboardPage() {
  const overview = dashboardService.getOverview();
  const [period, setPeriod] = useState<'This Month' | 'Last Month' | 'This Semester'>('This Semester');
  const subjectData = useMemo(() => attendanceService.getTrend(period), [period]);
  const summary = overview.attendance;
  const cgpa = resultsService.getCgpa();
  const latest = overview.semesters.filter(s => s.status === 'Completed').at(-1);
  const distRaw = attendanceService.getRecords().reduce((acc, r) => { acc[r.status] += 1; return acc; }, { Present: 0, Absent: 0, Excused: 0 });
  const distTotal = Math.max(1, Object.values(distRaw).reduce((a, b) => a + b, 0));
  const distribution = [
    { name: 'Present', value: Math.round(distRaw.Present / distTotal * 100), color: '#6842d9' },
    { name: 'Absent', value: Math.round(distRaw.Absent / distTotal * 100), color: '#f7836b' },
    { name: 'Excused', value: 100 - Math.round(distRaw.Present / distTotal * 100) - Math.round(distRaw.Absent / distTotal * 100), color: '#9454f5' },
  ];
  const performanceTrend = overview.semesters.filter(s => s.status === 'Completed').map(s => ({ semester: `Sem ${s.semester}`, sgpa: s.sgpa ?? 0 }));
  const nextEvent = overview.upcomingEvents[0];
  return <>
    <div className="dashboard-greeting"><div><h1 className="greeting-title">Hello, <span>{overview.student.fullName}</span>!</h1><p className="greeting-subtitle">Here is your academic overview for today.</p></div><div className="quick-actions"><Link to="/attendance"><Button size="sm" variant="secondary" icon={<ClipboardCheck size={14} />}>View Attendance</Button></Link><Link to="/results"><Button size="sm" variant="primary" icon={<GraduationCap size={14} />}>View Results</Button></Link><Link to="/calendar"><Button size="sm" variant="outline" icon={<CalendarDays size={14} />}>Academic Calendar</Button></Link></div></div>
    <div className="stat-grid">
      <StatCard label="Overall Attendance" value={`${summary.percentage}%`} hint={`${summary.attended} present sessions · ${summary.conducted} recorded`} icon={<ClipboardCheck size={20} />} accent="purple" progress={summary.percentage} />
      <StatCard label="Current Semester" value={`Semester ${overview.student.semester}`} hint={`B.Tech CSE · ${overview.student.academicYear}`} icon={<BookOpen size={20} />} accent="coral" />
      <StatCard label="Academic Performance" value={cgpa.toFixed(2)} hint={`CGPA · latest SGPA ${latest?.sgpa?.toFixed(2) ?? '—'}`} icon={<Medal size={20} />} accent="blue" />
      <StatCard label="Upcoming Events" value={overview.upcomingEvents.length} hint={nextEvent ? `${nextEvent.title}` : 'No upcoming events'} icon={<CalendarDays size={20} />} accent="green" />
    </div>
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <Card><CardTitle title="Student Activity" subtitle="Compare attendance across your computer science subjects" right={<select className="filter-select" value={period} onChange={e => setPeriod(e.target.value as typeof period)} aria-label="Choose attendance chart period"><option>This Month</option><option>Last Month</option><option>This Semester</option></select>} />
          <div className="chart-container"><ResponsiveContainer width="100%" height="100%"><BarChart data={subjectData} margin={{ top: 10, right: 9, left: -18, bottom: 16 }} barCategoryGap="28%"><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f6" /><XAxis dataKey="short" tick={{ fontSize: 10, fill: '#8f97a9' }} axisLine={false} tickLine={false} dy={8} /><YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10, fill: '#9aa1b1' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f6ff' }} /><ReferenceLine y={75} stroke="#f7836b" strokeDasharray="5 5" label={{ value: '75% guideline', fill: '#c47b6c', fontSize: 9, position: 'insideTopRight' }} /><Bar dataKey="attendance" radius={[6, 6, 2, 2]} maxBarSize={36}>{subjectData.map((entry, index) => <Cell key={entry.short} fill={entry.attendance < 75 ? '#f7836b' : accentSeries[index % accentSeries.length]} />)}</Bar></BarChart></ResponsiveContainer></div>
          <div className="flex items-center justify-between gap-3 flex-wrap mt-1"><div className="legend-row"><span className="legend-item"><span className="legend-dot" style={{ background: '#6842d9' }} />Subject attendance</span><span className="legend-item"><span className="legend-dot" style={{ background: '#f7836b' }} />Below 75% threshold</span></div><Link to="/attendance" className="small-link">View full report <ArrowRight size={13} /></Link></div>
        </Card>
        <div className="dashboard-mini-grid">
          <Card className="mini-summary"><div className="mini-icon stat-purple"><TrendingUp size={18} /></div><div className="min-w-0"><p className="mini-label">Current CGPA</p><p className="mini-value">{cgpa.toFixed(2)} <span className="muted text-sm font-medium">/ 10</span></p><p className="mini-description">Based on completed semesters only.</p><Link to="/results" className="small-link">Academic results <ArrowRight size={12} /></Link></div></Card>
          <Card className="mini-summary"><div className="mini-icon stat-coral"><NotebookText size={18} /></div><div className="min-w-0"><p className="mini-label">Credits completed</p><p className="mini-value">{resultsService.getCompletedCredits()} <span className="muted text-sm font-medium">/ 160</span></p><p className="mini-description">Illustrative program credit total.</p><Link to="/results" className="small-link">View semester history <ArrowRight size={12} /></Link></div></Card>
        </div>
        <Card><CardTitle title="Semester Performance" subtitle="SGPA trend across published semesters" right={<Link to="/results" className="small-link">All results <ArrowRight size={13} /></Link>} /><div className="chart-container compact"><ResponsiveContainer width="100%" height="100%"><LineChart data={performanceTrend} margin={{ top: 12, right: 12, left: -18, bottom: 4 }}><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f6" /><XAxis dataKey="semester" tick={{ fontSize: 10, fill: '#929aab' }} axisLine={false} tickLine={false} /><YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 10, fill: '#929aab' }} axisLine={false} tickLine={false} /><Tooltip formatter={(v) => [`${Number(v).toFixed(2)} SGPA`, 'Performance']} contentStyle={{ borderRadius: 9, border: '1px solid #eeeaf9', fontSize: 11 }} /><Line dataKey="sgpa" type="monotone" stroke="#6842d9" strokeWidth={2.5} dot={{ r: 4, fill: '#6842d9', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div></Card>
      </div>
      <div className="dashboard-side">
        <Card><CardTitle title="Attendance distribution" subtitle="Session status breakdown · demo records" right={<Activity size={16} className="muted" />} /><div className="chart-container small"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={76} paddingAngle={4} stroke="none">{distribution.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'Sessions']} contentStyle={{ borderRadius: 9, border: '1px solid #eeeaf9', fontSize: 11 }} /><text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fill="#25283b" fontSize="22" fontWeight="650">{summary.percentage}%</text><text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#929aab" fontSize="9">attendance</text></PieChart></ResponsiveContainer></div><div className="legend-row justify-center mt-1">{distribution.map(item => <span key={item.name} className="legend-item"><span className="legend-dot" style={{ background: item.color }} />{item.name} {item.value}%</span>)}</div><p className="inline-note mt-3">Percentages are calculated from illustrative session records; excused sessions are reported separately.</p></Card>
        <Card><CardTitle title="Upcoming events" subtitle="What's next in your academic calendar" right={<CalendarDays size={16} className="muted" />} />
          {overview.upcomingEvents.slice(0, 4).map(event => { const date = parseISO(event.start); return <div className="event-row" key={event.id}><div className="event-date-block"><strong>{format(date, 'dd')}</strong><span>{format(date, 'MMM')}</span></div><div className="event-row-main"><strong>{event.title}</strong><div className="event-row-meta"><span className={`event-color event-${event.category.toLowerCase().replace(' ', '-')}`} /><span>{event.category}</span><span>·</span><span>{event.startTime ?? 'All day'}</span></div></div></div>; })}
          <Link to="/calendar" className="footer-link">Open full calendar <ArrowRight size={13} /></Link>
        </Card>
        <Card><CardTitle title="Recent messages" subtitle={`${overview.unreadCount} unread in your inbox`} right={<Mail size={16} className="muted" />} />
          {overview.messages.map(message => <Link to="/messages" key={message.id} className="message-preview"><div className="message-avatar">{message.avatar}</div><div className="message-preview-main"><div className="message-preview-head"><strong>{message.sender}</strong><small>{format(parseISO(message.timestamp), 'd MMM')}</small></div><p className="message-preview-subject">{message.subject}</p><p className="message-preview-copy">{message.preview}</p></div>{!message.read && <span className="message-unread" />}</Link>)}
          <Link to="/messages" className="footer-link">Go to messages <ArrowRight size={13} /></Link>
        </Card>
        <div className="callout-note"><CheckCircle2 size={15} /><span><strong>Demo data notice.</strong> Academic figures and notices are illustrative records for this prototype, not official student information.</span></div>
      </div>
    </div>
  </>;
}
