import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Notifications from './Notifications';
import { FaUserPlus, FaSignInAlt, FaCog, FaSignOutAlt, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>Bantayan Community Action Portal</Link>
      <div className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
        {!user ? (
          <>
            <Link to="/register" className={styles.link} onClick={() => setMenuOpen(false)}><FaUserPlus /> Register</Link>
            <Link to="/login" className={styles.link} onClick={() => setMenuOpen(false)}><FaSignInAlt /> Login</Link>
          </>
        ) : (
          <>
            <span className={styles.welcome}>Welcome {user.name}</span>
            <Notifications />
            <button className={styles.themeToggle} onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            {(user.role === 'admin' || user.role === 'co-admin') && <Link to="/admin" className={styles.link} onClick={() => setMenuOpen(false)}><FaCog /> Admin</Link>}
            <button className={styles.logoutBtn} onClick={() => { logout(); setMenuOpen(false); }}><FaSignOutAlt /> Logout</button>
          </>
        )}
      </div>
      <button className={styles.hamburger} onClick={toggleMenu}><FaBars /></button>
    </nav>
  );
};

export default Navbar;