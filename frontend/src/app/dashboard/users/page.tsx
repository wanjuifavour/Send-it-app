"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"
import { Users, Search, Filter, Trash2  } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getUsers, deleteUser } from "@/services/api";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { DeleteConfirmationModal } from "@/components/users/DeleteConfirmationModal"


interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  createdAt: string;
}

const itemsPerPage = 5;

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useStore();
  const { toast } = useToast()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.isAdmin) {
        const data = await getUsers();
        setUsers(data);
      }
    };
    fetchUsers();
  }, [user]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleDelete = async () => {
    if (!selectedUserId) return

    try {
      await deleteUser(selectedUserId)
      toast({ title: "Success", description: "User deleted successfully" })
      const data = await getUsers()
      setUsers(data)
      setDeleteModalOpen(false)
    } catch (error: unknown) {
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive"
      })
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="border rounded-lg px-4 py-2"
              aria-label="Filter by role"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
              <option>Driver</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id)
                          setDeleteModalOpen(true)
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Trash2  className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
              currentPage * itemsPerPage,
              users.length
            )} of {users.length} users
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-50"}`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-50"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={() => {
          getUsers().then(data => setUsers(data))
        }}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
