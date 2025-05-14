import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { usePaymentStore } from '../store/paymentStore';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuth();
  const { fetchUserPayments, userPayments, isLoading: paymentsLoading } = usePaymentStore();
  const [enrollments, setEnrollments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUserPayments();
  }, [fetchUserPayments]);
  
  useEffect(() => {
    if (userPayments) {
      setPendingPayments(userPayments.filter(payment => payment.status === 'pending'));
    }
  }, [userPayments]);
  
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            course_id,
            courses (
              id,
              title,
              image_url,
              thumbnail_url,
              short_description,
              level
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) throw error;
        
        const processedEnrollments = data?.map(enrollment => ({
          ...enrollment,
          courses: enrollment.courses
        })) || [];
        
        console.log("Enrollments data:", processedEnrollments);
        setEnrollments(processedEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);
  
  if (paymentsLoading || isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Main Layout Container */}
      <div className="flex flex-col pt-16">
        
        {/* Sidebar + Main Content Container */}
        <div className="flex flex-col lg:flex-row w-full">
        
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-6 sticky top-16">
            <div className="flex flex-col h-full">
              {/* User Profile Summary */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile?.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-700">
                        {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Student'}
                </h3>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
              
              {/* Quick Navigation */}
              <nav className="space-y-1 mb-8">
                <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-700">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link to="/courses" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Courses
                </Link>
                <Link to="/payments" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Payments
                </Link>
                <Link to="/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
              </nav>
              
              {/* Stats Summary */}
              <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Courses</span>
                  <span className="text-xs font-semibold text-slate-700">{enrollments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-slate-500">Pending Payments</span>
                  <span className="text-xs font-semibold text-slate-700">{pendingPayments.length}</span>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Mobile Welcome Banner */}
            <div className="flex justify-between items-center p-4 mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl lg:hidden">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Hi, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'}</h1>
                <p className="text-sm text-slate-500">Welcome to your dashboard</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile?.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-700">
                      {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Page Header */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <div className="flex space-x-2">
                <Link to="/courses" className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg bg-white text-slate-700 hover:bg-slate-50">
                  Browse Courses
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Enrolled Courses</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{enrollments.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                {enrollments.length > 0 && (
                  <div className="mt-4">
                    <Link to="/courses" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                      View all courses →
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Pending Payments</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{pendingPayments.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {pendingPayments.length > 0 && (
                  <div className="mt-4">
                    <Link to="/payments" className="text-sm font-medium text-red-600 hover:text-red-800">
                      Manage payments →
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Account Status</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">Active Student</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/profile" className="text-sm font-medium text-green-600 hover:text-green-800">
                    View profile →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* My Courses Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
                <Link to="/courses" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  View all
                </Link>
              </div>
              
              {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <div 
                      key={enrollment.id} 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow duration-300 flex flex-col"
                    >
                      <div className="relative h-40">
                        <img 
                          src={(enrollment.courses?.image_url || enrollment.courses?.thumbnail_url || 'https://via.placeholder.com/300x200?text=Course+Image')} 
                          alt={enrollment.courses?.title || 'Course'}
                          className="w-full h-full object-cover"
                        />
                        {enrollment.courses?.level && (
                          <span className="absolute top-3 right-3 bg-black/70 text-purple-400 text-xs px-3 py-1 rounded-full font-medium">
                            {enrollment.courses?.level}
                          </span>
                        )}
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 text-slate-800">{enrollment.courses?.title || 'Untitled Course'}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{enrollment.courses?.short_description || 'No description available'}</p>
                        
                        <Link 
                          to={`/courses/${enrollment.course_id}/learn`}
                          className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
                  <div className="w-16 h-16 mx-auto mb-4 text-purple-500 opacity-80">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800">No Courses Enrolled Yet</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">Start your learning journey by browsing our catalog and enrolling in courses.</p>
                  <Link 
                    to="/courses" 
                    className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </section>
            
            {/* Recent Activity or Payments Section */}
            {pendingPayments.length > 0 && (
              <section className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Pending Payments</h2>
                  <Link to="/payments" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                    View all
                  </Link>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {pendingPayments.slice(0, 3).map((payment) => (
                          <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-800">
                                {payment.courses?.title || 'Unknown Course'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-slate-800">${payment.amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
            
            {/* Learning Resources or Tips */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Learn Better</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-purple-100">
                  <div className="text-purple-600 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">Study Tips</h3>
                  <p className="text-slate-600 mb-4">Set aside dedicated time for learning. Break down courses into manageable chunks and take regular breaks.</p>
                  <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                    Read more tips →
                  </a>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 border border-blue-100">
                  <div className="text-blue-600 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">Schedule Learning</h3>
                  <p className="text-slate-600 mb-4">Create a consistent learning schedule. Consistency is key to mastering new skills and concepts.</p>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Create schedule →
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 