import React, { useContext } from 'react';
import { AuthContext } from './AuthContext.js';

function WelcomeMessage() {
    const { loggedinUser } = useContext(AuthContext);

  return (
    <div className='container welcome-msg'>
        {loggedinUser && <p>Welcome, {loggedinUser}</p>}
    </div>
  )
}

export default WelcomeMessage;