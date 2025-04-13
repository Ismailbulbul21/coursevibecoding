import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCourseStore } from '../store/courseStore';
import { usePaymentStore } from '../store/paymentStore';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCourse, currentCourse, isLoading: courseLoading } = useCourseStore();
  const { createPayment, isLoading: paymentLoading } = usePaymentStore();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);
  
  const onSubmit = async (data) => {
    setPaymentError('');
    
    try {
      const response = await createPayment(
        courseId,
        currentCourse.price,
        'mobile_money',
        'Pending manual verification'
      );
      
      if (response.error) {
        setPaymentError(response.error.message || 'Payment submission failed');
      } else {
        setPaymentSuccess(true);
        // Scroll to top to show success message
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setPaymentError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', error);
    }
  };
  
  if (courseLoading || !currentCourse) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/courses/${courseId}`} className="text-indigo-600 hover:text-indigo-800 inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Course
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Payment for {currentCourse.title}</h1>
        
        {paymentSuccess ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">Payment Request Submitted!</h3>
                <div className="mt-2 text-green-700">
                  <p>Your course enrollment request has been recorded. Please send payment to gain access to the course content.</p>
                  <p className="mt-3">You can check the status of your enrollment in your dashboard.</p>
                </div>
                <div className="mt-4">
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Course Details</h2>
                <span className="text-lg font-bold text-indigo-600">${currentCourse.price}</span>
              </div>
              <p className="text-gray-600">{currentCourse.title}</p>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Instructions</h2>
              
              <div className="bg-yellow-50 p-6 rounded-lg mb-8 border-2 border-yellow-400">
                <h3 className="text-xl font-bold text-yellow-800 mb-4 text-center">Send Payment To:</h3>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-800 mb-2">+252617211084</p>
                  <p className="text-gray-700">Please send exactly ${currentCourse.price} to this number</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Send ${currentCourse.price} to the number above.</li>
                  <li>Click the "Register for Course" button below.</li>
                  <li>The admin will verify your payment and grant you access.</li>
                  <li>You will be notified when your access is approved.</li>
                </ol>
              </div>
              
              {paymentError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p>{paymentError}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mt-8">
                  <Link
                    to={`/courses/${courseId}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className={`bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200 ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {paymentLoading ? 'Processing...' : 'Register for Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm; 