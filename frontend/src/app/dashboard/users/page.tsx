export default function ManageUsers() {
    return (
      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Manage Users</h2>
            <button className="view-all-btn">Add User</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 'USR-001',
                    name: 'John Smith',
                    email: 'john@example.com',
                    role: 'Admin',
                    status: 'Active'
                  },
                  {
                    id: 'USR-002',
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    role: 'User',
                    status: 'Active'
                  },
                  {
                    id: 'USR-003',
                    name: 'Mike Wilson',
                    email: 'mike@example.com',
                    role: 'User',
                    status: 'Inactive'
                  }
                ].map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn mr-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }