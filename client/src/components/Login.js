import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Form.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await axios.post('/api/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response.data.msg });
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Login</h2>
        {errors.general && <div className={styles.error}>{errors.general}</div>}
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} id="email" name="email" type="email" value={formData.email} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input className={styles.input} id="password" name="password" type="password" value={formData.password} onChange={onChange} required />
          </div>
          <button className={styles.submitBtn} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;