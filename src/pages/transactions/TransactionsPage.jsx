import { useState, useCallback } from 'react';
import { 
  useTransactions, 
  useCreateTransaction, 
  useUpdateTransaction, 
  useDeleteTransaction 
} from '../../hooks/useTransactions';
import TransactionFilter from '../../components/transactions/TransactionFilter';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionForm from '../../components/transactions/TransactionForm';
import ExportDropdown from '../../components/transactions/ExportDropdown';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

/**
 * Main Transactions Page
 * Responsible for state management, data fetching, and orchestrating components
 */
const TransactionsPage = () => {
  const currentDate = new Date();
  
  // Filtering and Pagination State
  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    categoryId: null,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Data Queries and Mutations
  const { data: transactionResponse, isLoading } = useTransactions(filters);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  // Extract Spring Boot Page data structure
  const transactions = transactionResponse?.data?.content || [];
  const totalPages = transactionResponse?.data?.totalPages || 0;

  // Handlers
  const handleFilterChange = useCallback(() => {
    // Whenever a filter (month/year/category) changes, ALWAYS reset page back to 0
    setFilters(prev => ({ ...prev, page: 0 }));
  }, []);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenModalForCreate = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleFormSubmit = (data) => {
    if (selectedTransaction) {
      // Edit mode
      updateMutation.mutate(
        { id: selectedTransaction.id, data },
        { onSuccess: handleCloseModal }
      );
    } else {
      // Create mode
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your daily incomes and expenses
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <ExportDropdown month={filters.month} year={filters.year} />
          
          <button
            onClick={handleOpenModalForCreate}
            className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <TransactionFilter 
        filters={filters} 
        setFilters={setFilters} 
        onFilterChange={handleFilterChange} 
      />

      {/* Transactions List */}
      <div className="mt-6">
        <TransactionList 
          transactions={transactions} 
          isLoading={isLoading} 
          onEdit={handleOpenModalForEdit}
          onDelete={handleDelete}
        />
        
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <Pagination 
            currentPage={filters.page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={selectedTransaction ? "Edit Transaction" : "Add New Transaction"}
      >
        <TransactionForm 
          initialData={selectedTransaction}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

    </div>
  );
};

export default TransactionsPage;
