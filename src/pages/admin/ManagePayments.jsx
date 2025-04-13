import { useState, useEffect } from 'react';
import { usePaymentStore } from '../../store/paymentStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const PaymentStatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'verified':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ManagePayments = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'verified', 'rejected'
  const { 
    fetchAllPayments, 
    payments, 
    isLoading, 
    updatePaymentStatus 
  } = usePaymentStore();

  useEffect(() => {
    fetchAllPayments();
  }, [fetchAllPayments]);

  const handleVerify = async (payment) => {
    await updatePaymentStatus(payment.id, 'verified', notes);
    setSelectedPayment(null);
    setNotes('');
    fetchAllPayments();
  };

  const handleReject = async (payment) => {
    await updatePaymentStatus(payment.id, 'rejected', notes);
    setSelectedPayment(null);
    setNotes('');
    fetchAllPayments();
  };
  
  const filteredPayments = filter === 'all' 
    ? payments 
    : payments?.filter(payment => payment.status === filter);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Manage Payments</h1>
      
      {/* Payment Info Box */}
      <div className="mb-8 bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-indigo-800 mb-2">Payment Verification</h2>
            <p className="text-indigo-700 mb-4">
              Check your mobile money account at <span className="font-bold text-xl">+252617211084</span> to verify payments.
            </p>
            <p className="text-sm text-indigo-600">
              Compare the payment amount with the course price before approving.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-indigo-700 mb-2">Filter payments:</div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('verified')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
              >
                Verified
              </button>
              <button 
                onClick={() => setFilter('rejected')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredPayments?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No {filter !== 'all' ? filter : ''} payments found.
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className={payment.status === 'pending' ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.profiles?.email || payment.users?.email || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.courses?.title || 'Unknown Course'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">${payment.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(payment.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerify(payment)}
                                className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setSelectedPayment(payment)}
                                className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                Details
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedPayment(payment)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            
            <div className="mb-4">
              <p><span className="font-bold">User:</span> {selectedPayment.profiles?.email || selectedPayment.users?.email}</p>
              <p><span className="font-bold">Course:</span> {selectedPayment.courses?.title}</p>
              <p><span className="font-bold">Amount:</span> <span className="font-bold text-lg">${selectedPayment.amount}</span></p>
              <p><span className="font-bold">Status:</span> <PaymentStatusBadge status={selectedPayment.status} /></p>
              <p><span className="font-bold">Date:</span> {new Date(selectedPayment.created_at).toLocaleString()}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Add notes about this payment..."
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedPayment(null)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
              {selectedPayment.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReject(selectedPayment)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedPayment)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments; 