import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'

// Layout Component
import Layout from './components/Layout'

// Error Boundary Component
import ErrorBoundary from './components/ErrorBoundary'

// Auth Components
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

// Public Pages
const Home = lazy(() => import('./pages/Home'))
const CourseCatalog = lazy(() => import('./pages/CourseCatalog'))
const CourseDetails = lazy(() => import('./pages/CourseDetails'))

// Protected Pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CourseContent = lazy(() => import('./pages/CourseContent'))
const PaymentForm = lazy(() => import('./pages/PaymentForm'))
const PaymentHistory = lazy(() => import('./pages/PaymentHistory'))
const Profile = lazy(() => import('./pages/Profile'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManageCourses = lazy(() => import('./pages/admin/ManageCourses'))
const ManagePayments = lazy(() => import('./pages/admin/ManagePayments'))
const CourseForm = lazy(() => import('./pages/admin/CourseForm'))
const LessonList = lazy(() => import('./pages/admin/LessonList'))
const LessonForm = lazy(() => import('./pages/admin/LessonForm'))

// Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import LoadingSpinner from './components/LoadingSpinner'

// Debug Admin Test
const AdminTest = () => {
  const { user, profile, isAdmin } = useAuth();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Access Test</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Auth Information</h2>
        <div className="mb-4">
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Is Admin (from context):</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Profile Loaded:</strong> {profile ? 'Yes' : 'No'}</p>
          <p><strong>Admin in Profile:</strong> {profile?.is_admin ? 'Yes' : 'No'}</p>
        </div>
        {isAdmin ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg">
            <p className="font-bold">✅ You have admin access!</p>
          </div>
        ) : (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <p className="font-bold">❌ You do NOT have admin access.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="courses" element={<CourseCatalog />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="admin-test" element={<AdminTest />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="courses/:courseId/learn" element={
                    <ErrorBoundary>
                      <CourseContent />
                    </ErrorBoundary>
                  } />
                  <Route path="courses/:courseId/payment" element={<PaymentForm />} />
                  <Route path="payments" element={<PaymentHistory />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/courses" element={<ManageCourses />} />
                  <Route path="admin/courses/new" element={<Suspense fallback={<LoadingSpinner />}><CourseForm /></Suspense>} />
                  <Route path="admin/courses/:courseId/edit" element={<Suspense fallback={<LoadingSpinner />}><CourseForm /></Suspense>} />
                  <Route path="admin/courses/:courseId/lessons" element={<Suspense fallback={<LoadingSpinner />}><LessonList /></Suspense>} />
                  <Route path="admin/courses/:courseId/lessons/new" element={<Suspense fallback={<LoadingSpinner />}><LessonForm /></Suspense>} />
                  <Route path="admin/courses/:courseId/lessons/:lessonId" element={<Suspense fallback={<LoadingSpinner />}><LessonForm /></Suspense>} />
                  <Route path="admin/payments" element={<ManagePayments />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  )
}

export default App
