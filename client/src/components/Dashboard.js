import React, { useContext } from 'react';
import { AuthContext } from './AuthContext.js';
import LogoutButton from './LogoutButton.js';
import CourseListing from './CourseListing.js';

function Dashboard() {
  const { loggedinUser } = useContext(AuthContext);

  return (
    <div>
      <div className='container-fluid'>
            <h2 className="text-center mt-5 custom-page-title">My Dashboard</h2>
        <CourseListing />
      </div>
    </div>
  )
}

export default Dashboard;