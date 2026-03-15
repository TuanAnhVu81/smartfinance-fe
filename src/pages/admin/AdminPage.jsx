import { useState } from 'react';
import { Users, ShieldCheck, Mail, Calendar, Settings, Search, MoreVertical, Lock, Unlock, AlertTriangle, MonitorCheck } from 'lucide-react';
import { useUsers, useToggleUserStatus, useAdminSummary } from '../../hooks/useAdmin';
import Modal from '../../components/common/Modal';
import { useQueryClient } from '@tanstack/react-query';

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Real data fetching
  const { data: usersResponse, isLoading: isUsersLoading } = useUsers();
  const { data: summaryResponse, isLoading: isSummaryLoading } = useAdminSummary();
  
  const users = usersResponse?.data?.content || [];
  const summary = summaryResponse?.data || {};
  
  const toggleStatusMutation = useToggleUserStatus();

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedUser) {
      toggleStatusMutation.mutate(
        { userId: selectedUser.id, isActive: !selectedUser.isActive },
        {
          onSuccess: () => {
            setIsConfirmModalOpen(false);
            setSelectedUser(null);
            // Also refresh summary since it might change (locked count)
            queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
          }
        }
      );
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header section remains similar but updated icons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Administration</h1>
          <p className="text-gray-500 text-sm mt-1">Manage user access and system security status.</p>
        </div>
      </div>

      {/* Stats row - Option 2: Simplified */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'System Users', value: isSummaryLoading ? '...' : summary.totalUsers || 0, icon: <Users size={20} />, color: 'blue' },
          { label: 'Active Admins', value: isSummaryLoading ? '...' : summary.totalAdmins || 0, icon: <ShieldCheck size={20} />, color: 'indigo' },
          { label: 'Locked Users', value: isSummaryLoading ? '...' : summary.totalLockedUsers || 0, icon: <Lock size={20} />, color: 'red' },
          { label: 'System Status', value: 'ONLINE', icon: <MonitorCheck size={20} />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main content - User Management */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            User Directory
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{filteredUsers.length}</span>
          </h2>
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isUsersLoading ? (
            <div className="p-10 flex justify-center flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm font-medium">Synchronizing user data...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-gray-500 tracking-widest">
                <tr>
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Access Level</th>
                  <th className="px-6 py-4">System Status</th>
                  <th className="px-6 py-4 text-center">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                      No users found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${user.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center font-bold shadow-sm`}>
                            {user.fullName?.charAt(0) || user.username?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.fullName || 'Anonymous User'}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <span className="opacity-70">@{user.username}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles?.map(role => (
                            <span key={role} className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                              role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center sm:text-left">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
                          {user.isActive ? 'Active' : 'Locked'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2 text-gray-400">
                          <button 
                            onClick={() => handleToggleClick(user)}
                            className={`p-2 rounded-xl transition-all ${
                              user.isActive 
                                ? 'hover:bg-red-50 hover:text-red-600 text-red-400' 
                                : 'hover:bg-green-50 hover:text-green-600 text-green-400'
                            }`}
                            title={user.isActive ? 'Lock User' : 'Unlock User'}
                          >
                            {user.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>
                          <div className="h-4 w-[1px] bg-gray-100"></div>
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors hover:text-gray-600">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={selectedUser?.isActive ? 'Security Action: Lock User' : 'Security Action: Unlock User'}
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-xl flex items-start gap-4 ${selectedUser?.isActive ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${selectedUser?.isActive ? 'text-red-600' : 'text-green-600'}`} />
            <div>
              <p className={`text-sm font-bold ${selectedUser?.isActive ? 'text-red-900' : 'text-green-900'}`}>
                Confirm {selectedUser?.isActive ? 'Locking' : 'Unlocking'} Account
              </p>
              <p className={`text-xs mt-1 leading-relaxed ${selectedUser?.isActive ? 'text-red-700' : 'text-green-700'}`}>
                {selectedUser?.isActive 
                  ? "Locking this account will immediately revoke the user's access to all system features. They will be logged out and cannot log back in until unlocked."
                  : "Unlocking this account will restore the user's access to the system. They will be able to log in normally."}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center py-2">
            Are you sure you want to proceed with <strong>{selectedUser?.fullName || selectedUser?.username}</strong>?
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleConfirmAction}
              disabled={toggleStatusMutation.isPending}
              className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                selectedUser?.isActive 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                  : 'bg-green-600 hover:bg-green-700 shadow-green-200'
              } disabled:opacity-50`}
            >
              {toggleStatusMutation.isPending ? 'Processing security update...' : `Yes, ${selectedUser?.isActive ? 'Lock' : 'Unlock'} this Account`}
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="w-full py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
