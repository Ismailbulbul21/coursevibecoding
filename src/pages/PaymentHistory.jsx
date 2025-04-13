import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePaymentStore } from '../store/paymentStore';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentStatusBadge = ({ status }) => {
  let className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ';
  
  switch (status) {
    case 'verified':
      className += 'bg-green-100 text-green-800';
      break;
    case 'pending':
      className += 'bg-yellow-100 text-yellow-800';
      break;
    case 'rejected':
      className += 'bg-red-100 text-red-800';
      break;
    default:
      className += 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={className}>
      {status === 'verified' && 'Verified'}
      {status === 'pending' && 'Pending Verification'}
      {status === 'rejected' && 'Rejected'}
      {!['verified', 'pending', 'rejected'].includes(status) && 'Unknown'}
    </span>
  );
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const { fetchUserPayments, userPayments, isLoading } = usePaymentStore();
  
  useEffect(() => {
    fetchUserPayments();
  }, [fetchUserPayments]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment History</h1>
      
      {userPayments && userPayments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
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
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userPayments.map((payment) => (
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
                      {payment.payment_method === 'mobile_money' ? 'Mobile Money' : 
                       payment.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                       payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_reference || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === 'verified' ? (
                        <Link 
                          to={`/courses/${payment.course_id}/learn`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Access Course
                        </Link>
                      ) : payment.status === 'rejected' ? (
                        <Link 
                          to={`/courses/${payment.course_id}/payment`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Try Again
                        </Link>
                      ) : (
                        <span className="text-gray-500">Awaiting Verification</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">You don't have any payment records yet.</p>
          <Link 
            to="/courses" 
            className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Browse Courses
          </Link>
        </div>
      )}
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Payment Verification</h2>
        <p className="text-gray-600 mb-4">
          Our team manually verifies all payments. If your payment status is "Pending Verification," please allow up to 24 hours for the verification process.
        </p>
        <p className="text-gray-600">
          If you have any questions about your payment, please contact our support team at{' '}
          <a 
            href="mailto:support@learningplatform.com" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            support@learningplatform.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentHistory; 