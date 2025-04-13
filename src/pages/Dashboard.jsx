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
      // Only set pending payments, not enrollments
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
        
        // Process the nested data to ensure it's in the correct format
        const processedEnrollments = data?.map(enrollment => ({
          ...enrollment,
          courses: enrollment.courses // Keep the courses object as is
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
  
  // Debug logging
  console.log("Rendering Dashboard with:", {
    enrollments,
    pendingPayments,
    user
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.user_metadata?.full_name || 'Student'}!</h2>
        <p className="text-gray-700">
          Track your course progress, manage your payments, and continue learning from where you left off.
        </p>
      </div>
      
      {/* Enrolled Courses */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={(enrollment.courses?.image_url || enrollment.courses?.thumbnail_url || 'https://via.placeholder.com/300x200?text=Course+Image')} 
                  alt={enrollment.courses?.title || 'Course'}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{enrollment.courses?.title || 'Untitled Course'}</h3>
                  <p className="text-gray-600 mb-4">{enrollment.courses?.short_description || 'No description available'}</p>
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {enrollment.courses?.level || 'All Levels'}
                    </span>
                    <Link 
                      to={`/courses/${enrollment.course_id}/learn`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">You have not enrolled in any courses yet.</p>
            <Link 
              to="/courses" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Explore Courses
            </Link>
          </div>
        )}
      </div>
      
      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Pending Payments</h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Reference
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
                {pendingPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.courses?.title || 'Unknown Course'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_reference || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending Verification
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            Your payments are being verified by our team. Once verified, you will gain access to the course.
          </p>
        </div>
      )}
      
      {/* Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 rounded-lg p-6 text-center">
          <h3 className="font-bold text-xl mb-3">Browse Courses</h3>
          <p className="text-gray-700 mb-4">Discover new courses to enhance your skills</p>
          <Link 
            to="/courses" 
            className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            View All Courses
          </Link>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-6 text-center">
          <h3 className="font-bold text-xl mb-3">Payment History</h3>
          <p className="text-gray-700 mb-4">View all your payment transactions</p>
          <Link 
            to="/payments" 
            className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            View Payments
          </Link>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-6 text-center">
          <h3 className="font-bold text-xl mb-3">Need Help?</h3>
          <p className="text-gray-700 mb-4">Contact our support team for assistance</p>
          <a 
            href="mailto:support@learningplatform.com" 
            className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 