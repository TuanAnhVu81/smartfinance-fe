import { useState } from 'react';
import useDashboard from '../../hooks/useDashboard';
import MonthYearPicker from '../../components/common/MonthYearPicker';
import SummaryCards from '../../components/dashboard/SummaryCards';
import CategoryPieChart from '../../components/dashboard/CategoryPieChart';
import MonthlyBarChart from '../../components/dashboard/MonthlyBarChart';

/**
 * Main Dashboard Page combining all dashboard components
 */
const DashboardPage = () => {
  // Initialize state with current month and year using lazy initialization
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  // Fetch all dashboard queries using custom hook
  const {
    summaryQuery,
    incomeChartQuery,
    expenseChartQuery,
    monthlyChartQuery,
  } = useDashboard(month, year);

  // Handle month/year change from picker
  const handleDateChange = ({ month: newMonth, year: newYear }) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Date Picker Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your financial situation for {new Date(year, month - 1).toLocaleString('en-US', { month: 'long' })} {year}
          </p>
        </div>
        
        <MonthYearPicker 
          month={month} 
          year={year} 
          onChange={handleDateChange} 
        />
      </div>

      {/* Summary Cards Section (3 columns) */}
      <SummaryCards 
        data={summaryQuery.data} 
        isLoading={summaryQuery.isLoading} 
      />

      {/* Charts Section (2 columns on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto">
        {/* Category Pie Chart */}
        <div className="h-[450px]">
          <CategoryPieChart 
            incomeData={incomeChartQuery.data}
            expenseData={expenseChartQuery.data}
            isLoading={incomeChartQuery.isLoading || expenseChartQuery.isLoading}
          />
        </div>

        {/* Monthly Bar Chart */}
        <div className="h-[450px]">
          <MonthlyBarChart 
            data={monthlyChartQuery.data}
            isLoading={monthlyChartQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
