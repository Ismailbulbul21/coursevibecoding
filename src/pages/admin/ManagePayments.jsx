import { useState, useEffect } from 'react';
import { usePaymentStore } from '../../store/paymentStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const PaymentStatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'pending':
      bgColor = 'bg-[#FF6B6B]/10';
      textColor = 'text-[#FF6B6B]';
      break;
    case 'verified':
      bgColor = 'bg-[#00E5A0]/10';
      textColor = 'text-[#00E5A0]';
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
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-[#2C1952] relative inline-block">
        Manage Payments
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D3BE7] to-[#FF6B6B] rounded-full"></span>
      </h1>
      
      {/* Payment Info Box */}
      <div className="mb-8 bg-gradient-to-r from-[#5D3BE7]/5 to-[#5D3BE7]/10 border-l-4 border-[#5D3BE7] p-5 rounded-xl shadow-sm animate-slide-up">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#2C1952] mb-2">Payment Verification</h2>
            <p className="text-[#8C8C9E] mb-4">
              Check your mobile money account at <span className="font-bold text-xl text-[#5D3BE7]">+252617211084</span> to verify payments.
            </p>
            <p className="text-sm text-[#8C8C9E]">
              Compare the payment amount with the course price before approving.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-[#8C8C9E] mb-2">Filter payments:</div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${filter === 'all' ? 'bg-[#5D3BE7] text-white' : 'bg-[#5D3BE7]/10 text-[#5D3BE7]'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${filter === 'pending' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('verified')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${filter === 'verified' ? 'bg-[#00E5A0] text-white' : 'bg-[#00E5A0]/10 text-[#00E5A0]'}`}
              >
                Verified
              </button>
              <button 
                onClick={() => setFilter('rejected')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredPayments?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-[#8C8C9E] border border-gray-100 animate-bounce-in">
          <svg className="w-16 h-16 text-[#5D3BE7]/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl font-medium mb-2">No {filter !== 'all' ? filter : ''} payments found</p>
          <p>When new payments arrive, they will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col animate-slide-up">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow-md overflow-hidden border border-gray-100 sm:rounded-xl">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-[#F5F7FF]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredPayments.map((payment, index) => (
                      <tr key={payment.id} className={`hover:bg-[#F5F7FF] transition-colors duration-150 animate-fade-in animate-delay-${index * 100 > 500 ? 500 : index * 100} ${payment.status === 'pending' ? 'bg-[#FF6B6B]/5' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#2C1952]">{payment.profiles?.email || payment.users?.email || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#2C1952]">{payment.courses?.title || 'Unknown Course'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-[#2C1952]">${payment.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#8C8C9E]">{new Date(payment.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerify(payment)}
                                className="bg-[#00E5A0]/10 text-[#00E5A0] hover:bg-[#00E5A0]/20 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setSelectedPayment(payment)}
                                className="bg-gray-100 text-[#2C1952] hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200"
                              >
                                Details
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedPayment(payment)}
                              className="text-[#5D3BE7] hover:text-[#4A2EC0] transition-colors duration-200"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full mx-4 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#2C1952] flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#5D3BE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Payment Details
            </h2>
            
            <div className="mb-6 bg-[#F5F7FF] p-4 rounded-lg">
              <p className="flex justify-between py-1 border-b border-[#5D3BE7]/10">
                <span className="text-[#8C8C9E]">User:</span> 
                <span className="font-medium text-[#2C1952]">{selectedPayment.profiles?.email || selectedPayment.users?.email}</span>
              </p>
              <p className="flex justify-between py-1 border-b border-[#5D3BE7]/10">
                <span className="text-[#8C8C9E]">Course:</span> 
                <span className="font-medium text-[#2C1952]">{selectedPayment.courses?.title}</span>
              </p>
              <p className="flex justify-between py-1 border-b border-[#5D3BE7]/10">
                <span className="text-[#8C8C9E]">Amount:</span> 
                <span className="font-bold text-[#2C1952]">${selectedPayment.amount}</span>
              </p>
              <p className="flex justify-between py-1 border-b border-[#5D3BE7]/10">
                <span className="text-[#8C8C9E]">Status:</span> 
                <PaymentStatusBadge status={selectedPayment.status} />
              </p>
              <p className="flex justify-between py-1">
                <span className="text-[#8C8C9E]">Date:</span> 
                <span className="text-[#2C1952]">{new Date(selectedPayment.created_at).toLocaleString()}</span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-[#2C1952] text-sm font-medium mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-[#5D3BE7] focus:border-[#5D3BE7] text-[#2C1952]"
                rows="3"
                placeholder="Add notes about this payment..."
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedPayment(null)}
                className="bg-gray-100 hover:bg-gray-200 text-[#2C1952] font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
              {selectedPayment.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(selectedPayment)}
                    className="bg-[#FF6B6B] hover:bg-[#E94E4E] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedPayment)}
                    className="bg-[#00E5A0] hover:bg-[#00C78A] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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