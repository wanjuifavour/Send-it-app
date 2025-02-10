export default function MyParcels() {
    return (
      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h2>My Parcels</h2>
            <button className="view-all-btn">Create New</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Recipient</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 'TRK-789012',
                    recipient: 'John Doe',
                    destination: 'New York, USA',
                    status: 'In Transit',
                    weight: '2.5 kg'
                  },
                  {
                    id: 'TRK-789013',
                    recipient: 'Alice Smith',
                    destination: 'London, UK',
                    status: 'Delivered',
                    weight: '1.8 kg'
                  },
                  {
                    id: 'TRK-789014',
                    recipient: 'Bob Johnson',
                    destination: 'Paris, France',
                    status: 'Pending',
                    weight: '3.2 kg'
                  }
                ].map((parcel) => (
                  <tr key={parcel.id}>
                    <td>#{parcel.id}</td>
                    <td>{parcel.recipient}</td>
                    <td>{parcel.destination}</td>
                    <td>
                      <span className={`status-badge ${parcel.status.toLowerCase().replace(' ', '-')}`}>
                        {parcel.status}
                      </span>
                    </td>
                    <td>{parcel.weight}</td>
                    <td>
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