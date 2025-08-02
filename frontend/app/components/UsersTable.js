"use client";

import { useState, useEffect } from 'react';
import { 
  Eye, 
  Edit, 
  UserX, 
  UserCheck,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  fetchUsers, 
  toggleUserStatus, 
  updateUserRole, 
  fetchStats 
} from '../utils/api';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    timeframe: '',
    sortBy: 'created_at',
    order: 'DESC'
  });
  const [stats, setStats] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const fetchUsersData = async () => {
    try {
      const data = await fetchUsers(filters);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsData = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch user statistics');
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      await toggleUserStatus(user.user_id);
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchUsersData();
      fetchStatsData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white font-medium rounded-lg ${
                action === 'makeAdmin'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : action === 'toggleStatus' && selectedUser?.is_active
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RoleDialog = ({ isOpen, onClose, onSubmit, currentRole }) => {
    if (!isOpen) return null;

    const roles = ['client', 'admin', 'logistics'];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Change User Role</h3>
          <p className="text-gray-600 mb-4">Select the new role for this user:</p>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => onSubmit(role)}
                disabled={role === currentRole}
                className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  role === currentRole
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize">{role}</span>
                  {role === currentRole && (
                    <span className="text-sm text-gray-500">Current</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const handleRoleChange = async (user) => {
    setSelectedUser(user);
    setAction('makeAdmin');
    setShowRoleDialog(true);
  };

  const handleRoleSubmit = async (newRole) => {
    try {
      await updateUserRole(selectedUser.user_id, newRole);
      toast.success(`User role updated to ${newRole} successfully`);
      fetchUsersData();
      fetchStatsData();
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setShowRoleDialog(false);
      setSelectedUser(null);
    }
  };

  const handleConfirm = async () => {
    try {
      if (action === 'makeAdmin') {
        const response = await fetch(
          `http://localhost:5000/admin/users/${selectedUser.user_id}/role`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'admin' })
          }
        );

        if (!response.ok) throw new Error('Failed to update role');
        toast.success('User role updated to admin successfully');
      } else if (action === 'toggleStatus') {
        const response = await fetch(
          `http://localhost:5000/admin/users/${selectedUser.user_id}/toggle-status`,
          { 
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (!response.ok) throw new Error('Failed to update status');
        toast.success(`User ${selectedUser.is_active ? 'deactivated' : 'activated'} successfully`);
      }

      // Refresh data
      await fetchUsers();
      await fetchStats();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed: ' + error.message);
    } finally {
      setShowConfirmDialog(false);
      setSelectedUser(null);
      setAction(null);
    }
  };

  useEffect(() => {
    fetchUsersData();
    fetchStatsData();
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="text-sm text-gray-500">Total Active Users</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stats.active_users}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="text-sm text-gray-500">Inactive Users</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stats.inactive_users}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="text-sm text-gray-500">New This Month</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stats.new_this_month}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="text-sm text-gray-500">Total Clients</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stats.total_clients}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select 
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={filters.role}
          onChange={(e) => setFilters(f => ({ ...f, role: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
          <option value="logistics">Logistics</option>
        </select>

        <select
          value={filters.timeframe}
          onChange={(e) => setFilters(f => ({ ...f, timeframe: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Time</option>
          <option value="this_month">This Month</option>
          <option value="this_week">This Week</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.full_name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.full_name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'logistics' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
                      ${user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.is_active ? 'bg-green-600' : 'bg-red-600'
                      }`}></span>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {!user.is_active && (
                      <span className="text-xs text-gray-500">
                        Access Restricted
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.last_login).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStatusToggle(user)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        user.is_active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="w-4 h-4" />
                          <span>Deactivate User</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Activate User</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleDialog(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Change Role</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setSelectedUser(null);
          setAction(null);
        }}
        onConfirm={handleConfirm}
        title={
          action === 'makeAdmin'
            ? 'Promote to Admin'
            : selectedUser?.is_active
            ? 'Deactivate User'
            : 'Activate User'
        }
        message={
          action === 'makeAdmin'
            ? `Are you sure you want to make ${selectedUser?.full_name} an admin? This will grant them full administrative privileges.`
            : selectedUser?.is_active
            ? `Are you sure you want to deactivate ${selectedUser?.full_name}? They will no longer be able to access the system.`
            : `Are you sure you want to activate ${selectedUser?.full_name}? They will regain access to the system.`
        }
      />
      <RoleDialog
        isOpen={showRoleDialog}
        onClose={() => {
          setShowRoleDialog(false);
          setSelectedUser(null);
        }}
        onSubmit={handleRoleSubmit}
        currentRole={selectedUser?.role}
      />
    </div>
  );
}