import type { ReactNode } from 'react';
export function StatCard({ label, value, hint, icon, accent = 'purple', progress }: { label: string; value: string | number; hint: string; icon: ReactNode; accent?: 'purple' | 'coral' | 'blue' | 'green'; progress?: number }) {
  return <div className="stat-card"><div className={`stat-icon stat-${accent}`}>{icon}</div><div className="stat-content"><p className="stat-label">{label}</p><div className="stat-value">{value}</div><p className="stat-hint">{hint}</p>{progress !== undefined && <div className="progress-track mt-3"><div className={`progress-fill fill-${accent}`} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>}</div></div>;
}
