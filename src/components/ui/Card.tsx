import type { HTMLAttributes, ReactNode } from 'react';
export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) { return <section className={`card ${className}`} {...props}>{children}</section>; }
export function CardTitle({ title, subtitle, right, icon }: { title: string; subtitle?: string; right?: ReactNode; icon?: ReactNode }) {
  return <div className="card-header"><div className="min-w-0">{icon && <span className="section-icon">{icon}</span>}<h2 className="card-title">{title}</h2>{subtitle && <p className="card-subtitle">{subtitle}</p>}</div>{right}</div>;
}
