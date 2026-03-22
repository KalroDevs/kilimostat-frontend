import React from 'react';

const MobileMenu = ({ isOpen, onClose, onOpenModal }) => {
  return (
    <>
      <div className={`mobile-menu-panel ${isOpen ? 'active' : ''}`}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px', 
          paddingBottom: '16px', 
          borderBottom: '1px solid var(--border-light)' 
        }}>
          <h3 style={{ color: 'var(--green-primary)' }}>KilimoSTAT</h3>
          <span className="close-menu" onClick={onClose}>&times;</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'var(--gray-text)', fontWeight: 600 }}>Home</a>
          
          <details style={{ marginBottom: '8px' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', padding: '8px 0', color: 'var(--gray-text)' }}>
              Data
            </summary>
            <div style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#">National and County</a>
              <a href="#">Kenya CAADP</a>
              <a href="#">Geospatial Data</a>
              <a href="#">API Access</a>
              <a href="#">Bulk Downloads</a>
            </div>
          </details>
          
          <details style={{ marginBottom: '8px' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', padding: '8px 0' }}>
              Dashboards
            </summary>
            <div style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#">KIAMIS</a>
              <a href="#">KAMIS</a>
              <a href="#">Crop Production</a>
              <a href="#">Livestock Monitor</a>
              <a href="#">Market Prices</a>
              <a href="#">Irrigation Index</a>
              <a href="#">Trade Analytics</a>
            </div>
          </details>
          
          <details style={{ marginBottom: '8px' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', padding: '8px 0' }}>
              Reports
            </summary>
            <div style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#">Publications</a>
              <a href="#">Annual Reports</a>
              <a href="#">Economic Surveys</a>
              <a href="#">Policy Outlook</a>
            </div>
          </details>
          
          <a href="#" style={{ textDecoration: 'none', color: 'var(--gray-text)', fontWeight: 600 }}>Food Systems</a>
          <a href="#" style={{ textDecoration: 'none', color: 'var(--gray-text)', fontWeight: 600 }}>About</a>
          <a href="#" style={{ textDecoration: 'none', color: 'var(--gray-text)', fontWeight: 600 }}>Definitions</a>
          <a href="#" style={{ textDecoration: 'none', color: 'var(--gray-text)', fontWeight: 600 }}>FAQ</a>
          
          <div className="mobile-auth">
            <button 
              className="btn-outline" 
              style={{ width: '100%', padding: '12px' }} 
              onClick={onOpenModal}
            >
              Log in
            </button>
            <button 
              className="btn" 
              style={{ width: '100%', padding: '12px', marginTop: '10px' }} 
              onClick={onOpenModal}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
    </>
  );
};

export default MobileMenu;