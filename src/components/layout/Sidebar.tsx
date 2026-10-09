import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, GraduationCap } from 'lucide-react';
import { mainNavigation } from '../../config/navigation';
import { messageService } from '../../services';
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, setRevision] = useState(0);
  useEffect(() => { const sync = () => setRevision(v => v + 1); window.addEventListener('ustudent-data-updated', sync); return () => window.removeEventListener('ustudent-data-updated', sync); }, []);
  const unread = messageService.getUnreadCount();
  return <><div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Primary navigation">
      <div className="sidebar-brand"><div className="brand-mark"><GraduationCap size={20} /></div><span>U<span className="brand-accent">Student</span></span><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={19} /></button></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav">{mainNavigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Messages' && unread > 0 && <span className="nav-badge">{unread}</span>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-art"><div className="help-sun" /><div className="help-stack" /><div className="help-person" /></div><p className="help-title">Keep learning</p><p className="help-copy">Explore tools to support your next milestone.</p><NavLink to="/explore" onClick={onClose} className="help-link">Explore resources <span>→</span></NavLink></div><div className="demo-note"><span className="demo-pulse" /> Demo environment · sample data</div></div>
    </aside></>;
}
