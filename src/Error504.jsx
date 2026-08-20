
import React from 'react';

const Error504 = () => {
  return (
    <div style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif', padding: '0', margin: '0', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <center><h1 style={{ marginTop: '20px', fontSize: '32px', fontWeight: 'bold' }}>504 Gateway Time-out</h1></center>
      <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '15px 0' }} />
      <center style={{ fontSize: '16px' }}>nginx</center>
    </div>
  );
};

export default Error504;
