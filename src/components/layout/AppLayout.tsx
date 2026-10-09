import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="app-shell"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><Topbar onMenu={() => setSidebarOpen(true)} /><main className="page-content">{children}<footer className="app-footer"><span>© 2026 UStudent</span><span>Academic demo portal <i /> Sample information only</span></footer></main></div></div>;
}
