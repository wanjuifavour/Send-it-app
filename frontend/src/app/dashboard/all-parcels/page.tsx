export default function AllParcels() {
    return (
      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h2>All Parcels</h2>
            <div className="flex gap-4">
              <select className="p-2 border rounded">
                <option value="">Filter by Status</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
              </select>
              <button className="view-all-btn">Export</button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 'TRK-001',
                    sender: 'John Doe',
                    recipient: 'Alice Smith',
                    origin: 'New York',
                    destination: 'Los Angeles',
                    status: 'In Transit'
                  },
                  {
                    id: 'TRK-002',
                    sender: 'Sarah Johnson',
                    recipient: 'Mike Wilson',
                    origin: 'Chicago',
                    destination: 'Miami',
                    status: 'Delivered'
                  },
                  {
                    id: 'TRK-003',
                    sender: 'Bob Brown',
                    recipient: 'Emma Davis',
                    origin: 'Houston',
                    destination: 'Seattle',
                    status: 'Pending'
                  }
                ].map((parcel) => (
                  <tr key={parcel.id}>
                    <td>#{parcel.id}</td>
                    <td>{parcel.sender}</td>
                    <td>{parcel.recipient}</td>
                    <td>{parcel.origin}</td>
                    <td>{parcel.destination}</td>
                    <td>
                      <span className={`status-badge ${parcel.status.toLowerCase().replace(' ', '-')}`}>
                        {parcel.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn mr-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fas fa-eye"></i>
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