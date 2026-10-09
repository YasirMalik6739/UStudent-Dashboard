import { useEffect, useRef, useState } from 'react';
import { Bell, Search, CalendarDays, ChevronDown, Menu, UserRound, Settings, LogIn, LogOut, CheckCheck, ArrowUpRight, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { studentService, searchService } from '../../services';
import { demoNotifications } from '../../data/demo/notifications';
import { useAuth } from '../../features/auth/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
const routeTitle: Record<string, string> = { '/dashboard': 'Dashboard', '/profile': 'Profile', '/attendance': 'Attendance', '/results': 'Academic Results', '/calendar': 'Academic Calendar', '/payments': 'Payment History', '/messages': 'Messages', '/explore': 'Explore', '/settings': 'Account Settings' };
export function Topbar({ onMenu }: { onMenu: () => void }) {
  const location = useLocation(); const navigate = useNavigate(); const { logout } = useAuth();
  const student = studentService.getProfile();
  const [, setRevision] = useState(0);
  useEffect(() => { const sync = () => setRevision(v => v + 1); window.addEventListener('ustudent-data-updated', sync); return () => window.removeEventListener('ustudent-data-updated', sync); }, []);
  const [query, setQuery] = useState(''); const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); const [notificationsOpen, setNotificationsOpen] = useState(false); const [logoutOpen, setLogoutOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); const userRef = useRef<HTMLDivElement>(null); const noticeRef = useRef<HTMLDivElement>(null);
  const results = searchService.search(query);
  const unreadNotifications = demoNotifications.filter(n => !n.read).length;
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!searchRef.current?.contains(target)) setSearchOpen(false);
      if (!userRef.current?.contains(target)) setMenuOpen(false);
      if (!noticeRef.current?.contains(target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler);
  }, []);
  const handleLogout = () => { logout(); setLogoutOpen(false); toast.success('You have been signed out of the demo.'); navigate('/login', { replace: true }); };
  return <>
    <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button><div className="topbar-page-title">{routeTitle[location.pathname] ?? (location.pathname.startsWith('/attendance/') ? 'Subject attendance' : 'Student portal')}</div>
      <div className="global-search" ref={searchRef}><Search size={17} className="search-icon" /><input value={query} onChange={e => { setQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Search anything..." aria-label="Search academic content" onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); } if (e.key === 'Enter' && results[0]) { navigate(results[0].path); setSearchOpen(false); } }} />{query && <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
        {searchOpen && query.trim() && <div className="search-popover">{results.length ? results.map((result, i) => <button key={`${result.type}-${result.title}-${i}`} className="search-result" onClick={() => { navigate(result.path); setSearchOpen(false); setQuery(''); }}><div className="search-result-main"><span className="search-result-title">{result.title}</span><span className="search-result-detail">{result.detail}</span></div><span className="search-type">{result.type}</span></button>) : <div className="search-empty">No matching records. Try a subject, message or event.</div>}</div>}
      </div></div>
      <div className="topbar-right"><div className="topbar-date"><CalendarDays size={16} /><span>{format(new Date(), 'd MMM yyyy')}</span></div><div className="dropdown-anchor" ref={noticeRef}><button className="icon-button topbar-action" onClick={() => { setNotificationsOpen(v => !v); setMenuOpen(false); }} aria-label={`Notifications, ${unreadNotifications} unread`}><Bell size={19} />{unreadNotifications > 0 && <span className="notification-dot" />}</button>{notificationsOpen && <div className="dropdown-panel notifications-panel"><div className="dropdown-heading"><div><strong>Notifications</strong><small>{unreadNotifications} unread updates</small></div><CheckCheck size={16} className="muted-icon" /></div>{demoNotifications.map(n => <div className="notification-item" key={n.id}><span className={`notification-mark ${n.read ? '' : 'unread'}`} /><div><p className="notification-title">{n.title}</p><p className="notification-copy">{n.detail}</p><span className="notification-time">{n.time} · demo</span></div></div>)}<Link to="/calendar" className="dropdown-footer" onClick={() => setNotificationsOpen(false)}>View academic calendar <ArrowUpRight size={14} /></Link></div>}</div>
        <div className="dropdown-anchor" ref={userRef}><button className="user-trigger" onClick={() => { setMenuOpen(v => !v); setNotificationsOpen(false); }} aria-expanded={menuOpen}><img src={student.avatarUrl} alt="" className="avatar" /><span className="user-trigger-info"><strong>{student.fullName}</strong><small>Student · Semester {student.semester}</small></span><ChevronDown size={15} className="muted-icon" /></button>{menuOpen && <div className="dropdown-panel user-menu"><div className="user-menu-head"><img src={student.avatarUrl} alt="" className="avatar avatar-lg" /><div><strong>{student.fullName}</strong><small>{student.id}</small></div></div><Link to="/profile" className="dropdown-link" onClick={() => setMenuOpen(false)}><UserRound size={16} /> View Profile</Link><Link to="/settings" className="dropdown-link" onClick={() => setMenuOpen(false)}><Settings size={16} /> Account Settings</Link><Link to="/login" className="dropdown-link" onClick={() => setMenuOpen(false)}><LogIn size={16} /> Login page</Link><button className="dropdown-link dropdown-danger" onClick={() => { setMenuOpen(false); setLogoutOpen(true); }}><LogOut size={16} /> Logout</button><div className="dropdown-footnote">Local demo session only</div></div>}</div>
      </div>
    </header>
    <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Sign out of UStudent?" size="sm"><p className="modal-copy">You will return to the demo login screen. Your locally edited profile, calendar events and message state will remain in this browser.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setLogoutOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleLogout} icon={<LogOut size={16} />}>Log out</Button></div></Modal>
  </>;
}
