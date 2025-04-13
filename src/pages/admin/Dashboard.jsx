import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import { usePaymentStore } from '../../store/paymentStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const { courses, fetchCourses, isLoading: coursesLoading } = useCourseStore();
  const { fetchAllPayments, payments, isLoading: paymentsLoading } = usePaymentStore();
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    pendingPayments: 0,
    totalRevenue: 0
  });
  
  useEffect(() => {
    fetchCourses();
    fetchAllPayments();
  }, [fetchCourses, fetchAllPayments]);
  
  useEffect(() => {
    if (courses && payments) {
      setStats({
        totalCourses: courses.length,
        publishedCourses: courses.filter(course => course.is_published).length,
        pendingPayments: payments.filter(payment => payment.status === 'pending').length,
        totalRevenue: payments
          .filter(payment => payment.status === 'verified')
          .reduce((total, payment) => total + parseFloat(payment.amount), 0)
      });
    }
  }, [courses, payments]);
  
  if (coursesLoading || paymentsLoading) {
    return <LoadingSpinner />;
  }
  
  // Get 5 most recent payments
  const recentPayments = payments
    ? [...payments]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Published Courses</p>
              <p className="text-2xl font-bold">{stats.publishedCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/courses"
          className="bg-indigo-600 text-white rounded-lg p-6 hover:bg-indigo-700 transition duration-200"
        >
          <h3 className="text-xl font-bold mb-2">Manage Courses</h3>
          <p>View, edit, create and delete courses</p>
        </Link>
        
        <Link
          to="/admin/payments"
          className="bg-indigo-600 text-white rounded-lg p-6 hover:bg-indigo-700 transition duration-200"
        >
          <h3 className="text-xl font-bold mb-2">Verify Payments</h3>
          <p>Review and process pending payments</p>
        </Link>
        
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Platform Health</h3>
          <p className="text-gray-700 mb-2">All systems operational</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Payments</h2>
            <Link 
              to="/admin/payments"
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.profiles?.full_name || payment.profiles?.email || 'Unknown User'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.courses?.title || 'Unknown Course'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.status === 'verified' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 