import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Array of short month names for X-Axis labels
 */
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Custom tooltip to format currency correctly
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Formats Y-axis ticks to a compact format (e.g., 1M, 1K) to save space
 * Optional improvement over just formatCurrency if values are very large
 */
const formatYAxisTick = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(0) + 'K';
  }
  return value;
};

/**
 * Displays a monthly bar chart comparing income and expenses for the entire year
 * @param {Object} props
 * @param {Object} props.data - Monthly chart data object { data: [{ month, totalIncome, totalExpense }] }
 * @param {boolean} props.isLoading - Loading state for skeleton
 */
const MonthlyBarChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col justify-end items-center">
        <div className="w-full flex justify-between items-end h-64 px-4 space-x-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex space-x-1 w-full justify-center">
              <div className="animate-pulse bg-gray-200 rounded-t w-full max-w-[12px] h-[40%]" />
              <div className="animate-pulse bg-gray-300 rounded-t w-full max-w-[12px] h-[60%]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Transform data to map month number to short month name
  const chartData = (data?.data || []).map(item => ({
    ...item,
    monthName: shortMonths[item.month - 1] || `Month ${item.month}`
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Annual Statistics</h2>
      
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="monthName" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              <Bar 
                dataKey="totalIncome" 
                name="Income" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
              <Bar 
                dataKey="totalExpense" 
                name="Expense" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p>No chart data available</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyBarChart;
