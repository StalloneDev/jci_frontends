import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Layout from '@/components/shared/Layout';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from '@/providers/NotificationProvider';

// Auth Pages
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import ForgotPassword from '@/components/auth/ForgotPassword';
import ResetPassword from '@/components/auth/ResetPassword';

// Dashboard
import Dashboard from '@/pages/Dashboard';

// Profile
import Profile from '@/pages/Profile';

// Members
import Members from '@/pages/Members';
import MemberForm from '@/components/members/MemberForm';
import MemberDetails from '@/components/members/MemberDetails';

// Commissions
const CommissionList = () => <div>Commission List</div>;
const CommissionForm = ({ isEditing }: { isEditing?: boolean }) => (
  <div>{isEditing ? 'Edit Commission' : 'New Commission'}</div>
);
const CommissionDetails = () => <div>Commission Details</div>;

// Trainings
const TrainingList = () => <div>Training List</div>;
const TrainingForm = ({ isEditing }: { isEditing?: boolean }) => (
  <div>{isEditing ? 'Edit Training' : 'New Training'}</div>
);
const TrainingDetails = () => <div>Training Details</div>;

// Meetings
const MeetingList = () => <div>Meeting List</div>;
const MeetingForm = ({ isEditing }: { isEditing?: boolean }) => (
  <div>{isEditing ? 'Edit Meeting' : 'New Meeting'}</div>
);
const MeetingDetails = () => <div>Meeting Details</div>;

// 404
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NotificationProvider>
          <Router>
            <div className="min-h-screen w-full flex flex-col">
              <Toaster position="top-right" />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={
                  <div className="flex-1 flex">
                    <Login />
                  </div>
                } />
                <Route path="/register" element={
                  <div className="flex-1 flex">
                    <Register />
                  </div>
                } />
                <Route path="/forgot-password" element={
                  <div className="flex-1 flex">
                    <ForgotPassword />
                  </div>
                } />
                <Route path="/reset-password/:token" element={
                  <div className="flex-1 flex">
                    <ResetPassword />
                  </div>
                } />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Profile */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Members */}
                    <Route path="/members" element={<Members />} />
                    <Route path="/members/new" element={<MemberForm />} />
                    <Route path="/members/:id" element={<MemberDetails />} />
                    <Route path="/members/:id/edit" element={<MemberForm isEditing />} />

                    {/* Commissions */}
                    <Route path="/commissions" element={<CommissionList />} />
                    <Route path="/commissions/new" element={<CommissionForm />} />
                    <Route path="/commissions/:id" element={<CommissionDetails />} />
                    <Route path="/commissions/:id/edit" element={<CommissionForm isEditing />} />

                    {/* Trainings */}
                    <Route path="/trainings" element={<TrainingList />} />
                    <Route path="/trainings/new" element={<TrainingForm />} />
                    <Route path="/trainings/:id" element={<TrainingDetails />} />
                    <Route path="/trainings/:id/edit" element={<TrainingForm isEditing />} />

                    {/* Meetings */}
                    <Route path="/meetings" element={<MeetingList />} />
                    <Route path="/meetings/new" element={<MeetingForm />} />
                    <Route path="/meetings/:id" element={<MeetingDetails />} />
                    <Route path="/meetings/:id/edit" element={<MeetingForm isEditing />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
