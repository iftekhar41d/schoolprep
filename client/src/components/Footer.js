import React from 'react';

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <div className='custom-footer'>
        <p>Copyright© {currentYear} </p>
    </div>
  )
}

export default Footer;