import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'; size?: 'sm' | 'md' | 'lg'; icon?: ReactNode; loading?: boolean };
export function Button({ children, variant = 'primary', size = 'md', icon, loading, className = '', ...props }: Props) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : icon}{children}
  </button>;
}
