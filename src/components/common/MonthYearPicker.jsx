/**
 * Controlled component for selecting month and year
 * @param {Object} props
 * @param {number} props.month - Selected month (1-12)
 * @param {number} props.year - Selected year
 * @param {Function} props.onChange - Callback with { month, year }
 */
const MonthYearPicker = ({ month, year, onChange }) => {
  const currentYear = new Date().getFullYear();
  
  // Generate array of 12 months
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate array of years (current year - 5 to current year)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).reverse();

  const handleMonthChange = (e) => {
    onChange({ month: parseInt(e.target.value, 10), year });
  };

  const handleYearChange = (e) => {
    onChange({ month, year: parseInt(e.target.value, 10) });
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2">
        <label htmlFor="month-select" className="text-sm font-medium text-gray-600">
          Month
        </label>
        <select
          id="month-select"
          value={month}
          onChange={handleMonthChange}
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none cursor-pointer"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(2000, m - 1).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="year-select" className="text-sm font-medium text-gray-600">
          Year
        </label>
        <select
          id="year-select"
          value={year}
          onChange={handleYearChange}
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none cursor-pointer"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthYearPicker;
