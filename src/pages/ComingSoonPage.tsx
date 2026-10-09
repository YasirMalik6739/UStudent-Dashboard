import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Bus, BriefcaseBusiness, Library, Settings2, Users, WandSparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
const descriptions: Record<string, { title: string; description: string; icon: typeof BookOpen }> = {
  library: { title: 'Library Services', description: 'A future module for searching resources, viewing borrowing history and discovering learning materials.', icon: Library },
  transport: { title: 'Campus Transport', description: 'A future home for campus routes, shuttle schedules and transport announcements.', icon: Bus },
  resources: { title: 'Course Resources', description: 'A future space for course reading lists, study links and faculty-shared reference material.', icon: BookOpen },
  career: { title: 'Career Development', description: 'A future collection of placement preparation material, resume guidance and interview resources.', icon: BriefcaseBusiness },
  clubs: { title: 'Student Clubs', description: 'A future directory of campus clubs, interest groups and student-led activities.', icon: Users },
  internships: { title: 'Internship Preparation', description: 'A future module for organizing internship applications and preparation checklists.', icon: WandSparkles },
  faculty: { title: 'Faculty Directory', description: 'A future directory for faculty profiles, office hours and department contact details.', icon: Users },
  reports: { title: 'Advanced Academic Reports', description: 'A future space for additional academic reporting and progress summaries.', icon: Settings2 },
};
export function ComingSoonPage() { const { feature = 'feature' } = useParams(); const item = descriptions[feature.toLowerCase()] ?? { title: feature.replaceAll('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), description: 'This optional feature is planned for a future version of the UStudent demo portal.', icon: WandSparkles }; const Icon = item.icon; return <div className="card coming-soon-wrap"><div><div className="coming-soon-icon"><Icon size={32} /></div><span className="badge badge-purple mb-4">Coming Soon</span><h2>{item.title}</h2><p>{item.description}</p><p className="text-[10px] mb-5">This secondary module is not implemented in the current prototype. Core attendance, results and calendar features are available.</p><Link to="/dashboard"><Button icon={<ArrowLeft size={14} />}>Back to dashboard</Button></Link></div></div>; }
