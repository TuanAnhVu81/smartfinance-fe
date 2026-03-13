import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Displays summary cards for total income, total expense, and balance
 * @param {Object} props
 * @param {Object} props.data - Summary data object { totalIncome, totalExpense, balance }
 * @param {boolean} props.isLoading - Loading state for skeleton
 */
const SummaryCards = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="animate-pulse bg-gray-200 rounded-xl h-28 w-full shadow-sm"></div>
        ))}
      </div>
    );
  }

  const { totalIncome = 0, totalExpense = 0, balance = 0 } = data?.data || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income</h3>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* Total Expense Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expense</h3>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(totalExpense)}
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Balance</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
