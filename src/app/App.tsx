import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { AttendancePage } from '../pages/AttendancePage';
import { AttendanceDetailPage } from '../pages/AttendanceDetailPage';
import { ResultsPage } from '../pages/ResultsPage';
import { CalendarPage } from '../pages/CalendarPage';
import { ProfilePage } from '../pages/ProfilePage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { MessagesPage } from '../pages/MessagesPage';
import { ExplorePage } from '../pages/ExplorePage';
import { LoginPage } from '../pages/LoginPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { NotFoundPage } from '../pages/NotFoundPage';
function LayoutRoute() { return <AppLayout><Outlet /></AppLayout>; }
export function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<LayoutRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/:subjectId" element={<AttendanceDetailPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/coming-soon/:feature" element={<ComingSoonPage />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
