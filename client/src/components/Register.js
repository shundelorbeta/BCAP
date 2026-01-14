import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';

const barangays = [
  'Atop-atop', 'Baigad', 'Bantigue(Poblacion)', 'Baod', 'Binaobao(Poblacion)', 'Botigues', 'Doong', 'Guiwanon', 'Hilotongan', 'Kabac', 'Kabangbang', 'Kampingganon', 'Kangkaibe', 'Lipayran', 'Luyongbaybay', 'Mojon', 'Obo-ob', 'Patao', 'Putian', 'Sillon', 'Suba(Poblacion)', 'Sulangan', 'Sungko', 'Tamiao', 'Ticad(poblacion)'
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    barangay: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      const address = { municipality: 'Bantayan', province: 'Cebu', barangay: formData.barangay };
      await axios.post('/api/auth/register', { ...formData, address });
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.response.data.msg });
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Register</h2>
        {errors.general && <div className={styles.error}>{errors.general}</div>}
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="firstName">First Name</label>
            <input className={styles.input} id="firstName" name="firstName" value={formData.firstName} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="middleName">Middle Name</label>
            <input className={styles.input} id="middleName" name="middleName" value={formData.middleName} onChange={onChange} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="lastName">Last Name</label>
            <input className={styles.input} id="lastName" name="lastName" value={formData.lastName} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} id="email" name="email" type="email" value={formData.email} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phone">Phone</label>
            <input className={styles.input} id="phone" name="phone" value={formData.phone} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="barangay">Barangay</label>
            <select className={styles.select} id="barangay" name="barangay" value={formData.barangay} onChange={onChange} required>
              <option value="">Select Barangay</option>
              {barangays.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input className={styles.input} id="password" name="password" type="password" value={formData.password} onChange={onChange} required />
          </div>
          <button className={styles.submitBtn} type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;