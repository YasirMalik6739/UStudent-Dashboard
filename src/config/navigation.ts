import { LayoutDashboard, UserRound, ClipboardCheck, GraduationCap, CalendarDays, CreditCard, Mail, Compass, Settings, BookOpen, Bus, Library } from 'lucide-react';
export const mainNavigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  { label: 'Results', path: '/results', icon: GraduationCap },
  { label: 'Academic Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'Payment', path: '/payments', icon: CreditCard },
  { label: 'Messages', path: '/messages', icon: Mail, badge: 3 },
  { label: 'Explore', path: '/explore', icon: Compass },
];
export const secondaryNavigation = [
  { label: 'Account Settings', path: '/settings', icon: Settings },
  { label: 'Library Services', path: '/coming-soon/library', icon: Library },
  { label: 'Campus Transport', path: '/coming-soon/transport', icon: Bus },
  { label: 'Course Resources', path: '/coming-soon/resources', icon: BookOpen },
];
