import { useState } from 'react';
import { 
  useBudgets, 
  useCreateBudget, 
  useUpdateBudget, 
  useDeleteBudget 
} from '../../hooks/useBudgets';
import MonthYearPicker from '../../components/common/MonthYearPicker';
import BudgetCard from '../../components/budgets/BudgetCard';
import BudgetForm from '../../components/budgets/BudgetForm';
import Modal from '../../components/common/Modal';

/**
 * Budgets Page
 * Orchestrates fetching, displaying, and mutating budget limits
 */
const BudgetsPage = () => {
  const currentDate = new Date();
  
  // Filter state
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  // Queries and Mutations
  const { data: responseData, isLoading } = useBudgets(month, year);
  const budgets = responseData?.data || [];
  
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  // Handlers
  const handleDateChange = ({ month: newMonth, year: newYear }) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleOpenCreateModal = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBudget(null);
  };

  const handleFormSubmit = (data) => {
    if (selectedBudget) {
      updateMutation.mutate(
        { id: selectedBudget.id, data },
        { onSuccess: handleCloseModal }
      );
    } else {
      createMutation.mutate(data, { onSuccess: handleCloseModal });
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-500 text-sm mt-1">
            Control your expenses with category limits
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <MonthYearPicker 
            month={month} 
            year={year} 
            onChange={handleDateChange} 
          />
          
          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Budget
          </button>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        // Skeleton Loading Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 h-40 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : budgets.length > 0 ? (
        // Data Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
          <div className="bg-blue-50 text-blue-500 w-20 h-20 rounded-full flex items-center justify-center mb-5">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Budgets Created</h2>
          <p className="text-gray-500 max-w-md mb-6">
            You haven't set any budget limits for {new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })} {year}. Start taking control of your expenses by creating one!
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex justify-center items-center px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-transparent rounded-lg hover:bg-blue-100 transition-colors"
          >
            Create First Budget
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedBudget ? "Edit Budget Limit" : "Create New Budget"}
      >
        <BudgetForm
          initialData={selectedBudget}
          currentMonth={month}
          currentYear={year}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

    </div>
  );
};

export default BudgetsPage;
