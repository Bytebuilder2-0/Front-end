import React, { useState } from 'react';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  const tabs = ['appointments', 'inprogress', 'completed', 'declined', 'history'];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="supervisor-dashboard">
      <h1>Supervisor Dashboard</h1>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'inprogress' && <InProgressTab />}
        {activeTab === 'completed' && <CompletedTab />}
        {activeTab === 'declined' && <DeclinedTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
  );
};

const AppointmentsTab = () => (
  <div>
    <h2>Appointments</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Vehicle</th>
          <th>Date</th>
          <th>Technician</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td>1</td>
          <td>John Doe</td>
          <td>Toyota Corolla</td>
          <td>2024-12-30</td>
          <td>
            <select>
              <option>Select Technician</option>
              <option>Technician A</option>
              <option>Technician B</option>
            </select>
          </td>
          <td><button>Assign</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const InProgressTab = () => (
  <div>
    <h2>In Progress</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Vehicle</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td>1</td>
          <td>Jane Smith</td>
          <td>Honda Civic</td>
          <td>Repairing</td>
          <td>
            <button>Write Suggestions</button>
            <button>View Messages</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const CompletedTab = () => (
  <div>
    <h2>Completed</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Vehicle</th>
          <th>Budget</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td>1</td>
          <td>Mike Johnson</td>
          <td>Ford Focus</td>
          <td>$200</td>
          <td>
            <button>Set Budget</button>
            <button>Generate Invoice</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DeclinedTab = () => (
  <div>
    <h2>Declined</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Vehicle</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td>1</td>
          <td>Emily Davis</td>
          <td>Nissan Altima</td>
          <td>Technician Unavailable</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const HistoryTab = () => (
  <div>
    <h2>History</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Vehicle</th>
          <th>Payment Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td>1</td>
          <td>Chris Evans</td>
          <td>Chevrolet Malibu</td>
          <td>Paid</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SupervisorDashboard;
