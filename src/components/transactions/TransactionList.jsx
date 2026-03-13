import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Renders a list of transactions with responsive table/list layout
 * @param {Object} props
 * @param {Array} props.transactions - Array of transaction objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onEdit - Callback to edit a transaction
 * @param {Function} props.onDelete - Callback to delete a transaction
 */
const TransactionList = ({ transactions, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center animate-pulse">
            <div className="flex items-center space-x-4 w-1/2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p className="text-lg font-medium text-gray-600">No transactions found</p>
        <p className="text-sm mt-1 text-gray-400">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Category</th>
              <th scope="col" className="px-6 py-4 font-semibold">Note</th>
              <th scope="col" className="px-6 py-4 font-semibold">Date</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">Amount</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isIncome = transaction.category?.type === 'INCOME';
              
              return (
                <tr key={transaction.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-base">
                      {transaction.category?.icon || (isIncome ? '💰' : '💸')}
                    </span>
                    {transaction.category?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate" title={transaction.note}>
                    {transaction.note || <span className="text-gray-400 italic">No note</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {transaction.transactionDate ? format(new Date(transaction.transactionDate), 'MMM dd, yyyy') : '-'}
                  </td>
                  <td className={`px-6 py-4 font-bold text-right whitespace-nowrap ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md transition-colors mr-2"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this transaction?')) {
                          onDelete(transaction.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* List for mobile screens */}
      <div className="md:hidden divide-y divide-gray-100">
        {transactions.map((transaction) => {
          const isIncome = transaction.category?.type === 'INCOME';

          return (
            <div key={transaction.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-xl shrink-0">
                    {transaction.category?.icon || (isIncome ? '💰' : '💸')}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.category?.name || 'Unknown'}</h4>
                    <p className="text-xs text-gray-500">
                      {transaction.transactionDate ? format(new Date(transaction.transactionDate), 'MMM dd, yyyy') : '-'}
                    </p>
                  </div>
                </div>
                <div className={`font-bold text-right ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
              
              {transaction.note && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                  {transaction.note}
                </p>
              )}
              
              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={() => onEdit(transaction)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this transaction?')) {
                      onDelete(transaction.id);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
