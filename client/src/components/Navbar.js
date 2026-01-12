import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      {!user ? (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <span>Welcome {user.name}</span>
          {(user.role === 'admin' || user.role === 'co-admin') && <Link to="/admin">Admin</Link>}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;