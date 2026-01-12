import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" onChange={onChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;