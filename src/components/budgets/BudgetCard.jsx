import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Renders an individual Budget Card showing spent progress against a limit
 * @param {Object} props
 * @param {Object} props.budget - Budget data object from backend
 * @param {Function} props.onEdit - Callback to edit budget
 * @param {Function} props.onDelete - Callback to delete budget
 */
const BudgetCard = ({ budget, onEdit, onDelete }) => {
  // Extract data from the budget object
  const categoryName = budget.category?.name || 'Unknown Category';
  const categoryIcon = budget.category?.icon || '📦';
  const spentAmount = budget.spentAmount || 0;
  const amountLimit = budget.amountLimit || 0;
  
  // Calculate remaining money, if negative it means over budget
  const remaining = amountLimit - spentAmount;
  const isOverBudget = remaining < 0;

  // Use the percentage pre-calculated by backend. Cap visual bar at 100%.
  const percentage = budget.percentage || 0;
  const visualPercentage = Math.min(percentage, 100);

  // Determine progress bar color based on percentage thresholds
  let progressBarColor = 'bg-green-500'; // Good: < 80%
  if (percentage >= 100) {
    progressBarColor = 'bg-red-500'; // Danger/Over: >= 100%
  } else if (percentage >= 80) {
    progressBarColor = 'bg-yellow-500'; // Warning: 80% - 99.9%
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative group">
      
      {/* Action Buttons (Visible on hover on large screens, always on mobile) */}
      <div className="absolute top-4 right-4 flex space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(budget)}
          className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-md transition-colors"
          title="Edit Limit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this budget?')) {
              onDelete(budget.id);
            }
          }}
          className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-md transition-colors"
          title="Delete Budget"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>

      {/* Header Info */}
      <div className="flex items-center gap-3 mb-4 pr-16">
        <span className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full text-2xl">
          {categoryIcon}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">{categoryName}</h3>
          <p className="text-sm text-gray-500">
            Limit: <span className="font-medium text-gray-700">{formatCurrency(amountLimit)}</span>
          </p>
        </div>
      </div>

      {/* Amounts */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Spent</p>
          <p className="font-bold text-gray-800 text-lg">{formatCurrency(spentAmount)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            {isOverBudget ? 'Over Budget' : 'Remaining'}
          </p>
          <p className={`font-bold text-lg ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {isOverBudget ? formatCurrency(Math.abs(remaining)) : formatCurrency(remaining)}
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
        {/* Actual Progress */}
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
          style={{ width: `${visualPercentage}%` }}
        ></div>
      </div>
      
      {/* Percentage Text */}
      <div className="text-right">
        <span className="text-xs font-medium text-gray-500">{percentage}% used</span>
      </div>

    </div>
  );
};

export default BudgetCard;
