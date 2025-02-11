export default function Settings() {
    return (
      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Settings</h2>
          </div>
          <div className="p-6">
            <div className="settings-grid">
              <div className="setting-section">
                <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input type="text" className="w-full p-2 border rounded" defaultValue="SendIt Logistics" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" className="w-full p-2 border rounded" defaultValue="admin@sendit.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" className="w-full p-2 border rounded" defaultValue="+1 234 567 890" />
                  </div>
                  <button className="view-all-btn">Save Changes</button>
                </form>
              </div>
  
              <div className="setting-section mt-8">
                <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>
  
              <div className="setting-section mt-8">
                <h3 className="text-xl font-semibold mb-4">Security</h3>
                <div className="space-y-4">
                  <button className="view-all-btn">Change Password</button>
                  <button className="view-all-btn">Enable 2FA</button>
                  <button className="view-all-btn bg-red-500 text-white">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  