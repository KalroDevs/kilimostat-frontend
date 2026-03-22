import React from 'react';

const Header = ({
  language,
  notificationCount,
  isDarkMode,
  onToggleDarkMode,
  onNotification,
  onLanguageChange,
  onOpenModal,
  onOpenMobileMenu
}) => {
  return (
    <div className="header-wrapper">
      <div className="container">
        <div className="logo-section">
          <div className="logo-area">
            <div className="logo-icon">
              <img src="img/gok-logo-flag.png" alt="MOALD Logo" />
            </div>
            <div className="logo-text">
              <h3>KilimoSTAT</h3>
              <p>Ministry of Agriculture and Livestock Development (MoALD)|<sup>Kenya</sup></p>
            </div>
          </div>
          
          <div className="top-actions">
            <div className="toolbar-icons">
              <button className="icon-btn" onClick={onToggleDarkMode} title="Dark Mode">
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <button className="icon-btn" onClick={onNotification} title="Notifications">
                <i className="fas fa-bell"></i>
                {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
              </button>
              <div className="lang-selector">
                <div className="lang-btn">
                  <i className="fas fa-globe"></i> {language} <i className="fas fa-chevron-down"></i>
                </div>
                <div className="lang-dropdown">
                  <a href="#" onClick={(e) => { e.preventDefault(); onLanguageChange('EN', 'English'); }}>
                    🇬🇧 English
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); onLanguageChange('SW', 'Kiswahili'); }}>
                    🇰🇪 Kiswahili
                  </a>
                </div>
              </div>
            </div>
            <div className="auth-buttons">
              <button className="btn-outline" style={{ padding: '8px 20px' }} onClick={onOpenModal}>
                Log in
              </button>
              &nbsp;&nbsp;
              <button className="btn" style={{ padding: '8px 20px' }} onClick={onOpenModal}>
                Register
              </button>
            </div>
            <div className="mobile-toggle" onClick={onOpenMobileMenu}>
              <i className="fas fa-bars"></i>
            </div>
          </div>
        </div>
      </div>
      
      <MainMenu />
    </div>
  );
};

const MainMenu = () => {
  return (
    <div className="main-menu-section">
      <div className="container">
        <ul className="main-nav">
          <li className="nav-item"><a href="#" className="nav-link">Home</a></li>
          <li className="nav-item">
            <a href="#" className="nav-link">Data <i className="fas fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#"><i className="fas fa-table"></i> National and County</a>
              <a href="#"><i className="fas fa-chart-line"></i> Kenya CAADP</a>
              <a href="#"><i className="fas fa-map"></i> Geospatial Data</a>
              <a href="#"><i className="fas fa-code"></i> API Access</a>
              <a href="#"><i className="fas fa-download"></i> Bulk Downloads</a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Dashboards <i className="fas fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#"><i className="fas fa-chart-line"></i> KIAMIS</a>
              <a href="#"><i className="fas fa-chart-line"></i> KAMIS</a>
              <a href="#"><i className="fas fa-tractor"></i> Crop Production</a>
              <a href="#"><i className="fas fa-tractor"></i> Livestock Monitor</a>
              <a href="#"><i className="fas fa-chart-pie"></i> Market Prices</a>
              <a href="#"><i className="fas fa-water"></i> Irrigation Index</a>
              <a href="#"><i className="fas fa-chart-bar"></i> Trade Analytics</a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Reports <i className="fas fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#"><i className="fas fa-file-pdf"></i> Publications</a>
              <a href="#"><i className="fas fa-file-pdf"></i> Annual Reports</a>
              <a href="#"><i className="fas fa-chart-column"></i> Economic Reviews</a>
              <a href="#"><i className="fas fa-chart-line"></i> Policy Outlook</a>
            </div>
          </li>
          <li className="nav-item"><a href="#" className="nav-link">Food Systems</a></li>
          <li className="nav-item"><a href="#" className="nav-link">About</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Definitions</a></li>
          <li className="nav-item"><a href="#" className="nav-link">FAQ <i className="fas fa-question-circle"></i></a></li>
        </ul>
      </div>
    </div>
  );
};

export default Header;