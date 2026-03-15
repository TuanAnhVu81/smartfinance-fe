import { useState, useMemo } from 'react';
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '../../hooks/useCategories';
import CategoryList from '../../components/categories/CategoryList';
import CategoryForm from '../../components/categories/CategoryForm';
import Modal from '../../components/common/Modal';
import { Plus } from 'lucide-react';

const CategoriesPage = () => {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, INCOME, EXPENSE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Queries & Mutations
  const { data: categoryResponse, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Extract data
  const allCategories = categoryResponse?.data || [];

  // Filter based on active tab
  const filteredCategories = useMemo(() => {
    if (activeTab === 'ALL') return allCategories;
    return allCategories.filter(cat => cat.type === activeTab);
  }, [allCategories, activeTab]);

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = (data, setError) => {
    if (selectedCategory) {
      updateMutation.mutate(
        { id: selectedCategory.id, data },
        { 
          onSuccess: handleCloseModal,
          onError: (error) => {
            if (error?.response?.status === 400 || error?.response?.status === 409) {
              setError('root', { message: error.response.data.message || 'Validation error' });
            }
          }
        }
      );
    } else {
      createMutation.mutate(data, { 
        onSuccess: handleCloseModal,
        onError: (error) => {
          if (error?.response?.status === 400 || error?.response?.status === 409) {
            setError('root', { message: error.response.data.message || 'Validation error' });
          }
        }
      });
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your income and expense categories
          </p>
        </div>
        
        <button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" />
          Create Category
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 inline-flex w-full sm:w-auto overflow-x-auto">
        {['ALL', 'EXPENSE', 'INCOME'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab === 'ALL' ? 'All' : tab === 'EXPENSE' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      {/* Category List */}
      <div className="mt-6">
        <CategoryList 
          categories={filteredCategories}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal for Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={selectedCategory ? "Edit Category" : "Create New Category"}
      >
        <CategoryForm 
          initialData={selectedCategory}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

    </div>
  );
};

export default CategoriesPage;
