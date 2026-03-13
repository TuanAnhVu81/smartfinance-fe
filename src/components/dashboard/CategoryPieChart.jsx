import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

/**
 * Custom formatter for legend text to display category name and percentage
 */
const renderLegendText = (value, entry) => {
  const { payload } = entry;
  return (
    <span className="text-gray-700 text-sm font-medium">
      {payload.categoryName} <span className="text-gray-500">({payload.percentage}%)</span>
    </span>
  );
};

/**
 * Custom tooltip to display formatted currency
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
        <p className="font-semibold text-gray-800 mb-1">{data.categoryName}</p>
        <p className="text-gray-600">
          Amount: <span className="font-bold">{formatCurrency(data.totalAmount)}</span>
        </p>
        <p className="text-gray-500 text-sm">Percentage: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

/**
 * Displays a pie chart for categories with income and expense tabs
 * @param {Object} props
 * @param {Object} props.incomeData - Array of income category data
 * @param {Object} props.expenseData - Array of expense category data
 * @param {boolean} props.isLoading - Loading state for skeleton
 */
const CategoryPieChart = ({ incomeData, expenseData, isLoading }) => {
  const [activeTab, setActiveTab] = useState('EXPENSE');

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-full w-48 h-48 mx-auto"></div>
      </div>
    );
  }

  // Extract array data from response structure (data.data)
  const currentData = activeTab === 'EXPENSE' ? expenseData?.data || [] : incomeData?.data || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Category Structure</h2>
        
        {/* Tabs for switching between Income and Expense */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('EXPENSE')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setActiveTab('INCOME')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {currentData.length > 0 ? (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="totalAmount"
                nameKey="categoryName"
              >
                {currentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                formatter={renderLegendText}
                wrapperStyle={{ paddingLeft: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
          </svg>
          <p>No data for this month</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
