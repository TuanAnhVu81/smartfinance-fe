import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import EmptyState from '../common/EmptyState';
import { Receipt, Edit2, Trash2 } from 'lucide-react';

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block">
          <div className="w-full text-left p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center animate-pulse border-b border-gray-50 pb-4">
                <div className="flex items-center space-x-4 w-1/3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:hidden p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center animate-pulse border-b border-gray-50 pb-4">
              <div className="flex items-center space-x-3 w-2/3">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState 
        title="No transactions found"
        description="Try adjusting your filters or click 'Add Transaction' to log your first income or expense for this month."
        icon={<Receipt className="w-8 h-8" />}
      />
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
              <th scope="col" className="px-6 py-4 font-semibold text-center sticky right-0 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isIncome = transaction.category?.type === 'INCOME';
              
              return (
                <tr key={transaction.id} className="bg-white border-b border-gray-50 hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-base">
                      {transaction.category?.icon || (isIncome ? '💰' : '💸')}
                    </span>
                    {transaction.category?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 max-w-[250px] truncate" title={transaction.note}>
                    {transaction.note || <span className="text-gray-400 italic">No note</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {transaction.transactionDate ? format(new Date(transaction.transactionDate), 'MMM dd, yyyy') : '-'}
                  </td>
                  <td className={`px-6 py-4 font-bold text-right whitespace-nowrap ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 transition-colors border-l border-transparent group-hover:border-gray-100">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md transition-colors mr-2"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
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
                      <Trash2 className="w-4 h-4" />
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
            <div key={transaction.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-xl shrink-0">
                    {transaction.category?.icon || (isIncome ? '💰' : '💸')}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{transaction.category?.name || 'Unknown'}</h4>
                    <p className="text-xs text-gray-500">
                      {transaction.transactionDate ? format(new Date(transaction.transactionDate), 'MMM dd, yyyy') : '-'}
                    </p>
                  </div>
                </div>
                <div className={`font-bold text-right shrink-0 ml-2 ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
              
              {transaction.note && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-words">
                  {transaction.note}
                </p>
              )}
              
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-50">
                <button
                  onClick={() => onEdit(transaction)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this transaction?')) {
                      onDelete(transaction.id);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
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
