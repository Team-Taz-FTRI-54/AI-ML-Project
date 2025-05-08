import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar: React.FC = () => {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navRight}>
          {/*prettier-ignore*/}
          <ul>
            <li><Link to="/" className={styles.navi}>Home</Link></li>
            <li><Link to="/history" className={styles.navi}>History</Link></li>
            <li><Link to="/signup" className={styles.navi}>Sign Up</Link></li>
            <li><Link to="/login" className={styles.navi}>Login</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
