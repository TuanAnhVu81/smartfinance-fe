import MonthYearPicker from '../common/MonthYearPicker';
import { useCategories } from '../../hooks/useCategories';

/**
 * Component for filtering transactions by date and category
 * @param {Object} props
 * @param {Object} props.filters - Current filter state { month, year, categoryId }
 * @param {Function} props.setFilters - State setter for filters
 * @param {Function} props.onFilterChange - Callback when a filter value actually changes
 */
const TransactionFilter = ({ filters, setFilters, onFilterChange }) => {
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useCategories();
  
  // Extract category array from backend response format
  const categories = categoryResponse?.data || [];

  /**
   * Handlers wrap setFilters and call onFilterChange 
   * to potentially reset page number to 0
   */
  const handleDateChange = ({ month, year }) => {
    setFilters(prev => ({ ...prev, month, year }));
    if (onFilterChange) onFilterChange({ month, year });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const categoryId = value === 'all' ? null : parseInt(value, 10);
    
    setFilters(prev => ({ ...prev, categoryId }));
    if (onFilterChange) onFilterChange({ categoryId });
  };

  const handleReset = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const defaultFilters = {
      month: currentMonth,
      year: currentYear,
      categoryId: null
    };
    
    setFilters(prev => ({ ...prev, ...defaultFilters }));
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
      
      {/* Month & Year Picker */}
      <div className="w-full sm:w-auto">
        <MonthYearPicker 
          month={filters.month} 
          year={filters.year} 
          onChange={handleDateChange} 
        />
      </div>

      {/* Right side: Category Dropdown & Reset Button */}
      <div className="flex w-full sm:w-auto items-center gap-3">
        {/* Category Dropdown */}
        <div className="flex-grow min-w-[160px]">
          <select
            value={filters.categoryId === null ? 'all' : filters.categoryId}
            onChange={handleCategoryChange}
            disabled={isCategoriesLoading}
            className="w-full border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none bg-white text-gray-700"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.type === 'INCOME' ? '🟢' : '🔴'} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>
      
    </div>
  );
};

export default TransactionFilter;
