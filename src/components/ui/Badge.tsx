import type { ReactNode } from 'react';
type Tone = 'purple' | 'green' | 'orange' | 'red' | 'blue' | 'gray';
export function Badge({ children, tone = 'gray', dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) { return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>; }
export function statusTone(status: string): Tone {
  if (/good|present|successful|published|completed|read/i.test(status)) return 'green';
  if (/attention|processing|pending|in progress|upcoming|excused/i.test(status)) return 'orange';
  if (/below|absent|failed|error/i.test(status)) return 'red';
  if (/examination|academic|assignment|deadline/i.test(status)) return 'purple';
  if (/holiday|blue/i.test(status)) return 'blue';
  return 'gray';
}
