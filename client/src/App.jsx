import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

import ProtectedRoute from './components/ProtectedRoute';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import JobSearch from './pages/JobSearch';
import JobDetails from './pages/JobDetails';
import ManageJobs from './pages/ManageJobs';
import JobApplicants from './pages/JobApplicants';
import MyApplications from './pages/MyApplications';
import Onboarding from './pages/Onboarding'; // Import Onboarding


// Helper component to redirect based on role
const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return user.role === 'employer' ? <Navigate to="/dashboard/employer" /> : <Navigate to="/dashboard/seeker" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Generic Dashboard Redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />

            {/* Job Seeker Routes */}
            <Route
              path="/dashboard/seeker"
              element={
                <ProtectedRoute allowedRoles={['job_seeker']}>
                  <JobSeekerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Employer Routes */}
            <Route
              path="/dashboard/employer"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/jobs"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job/:id/applicants"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <JobApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute allowedRoles={['job_seeker']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
