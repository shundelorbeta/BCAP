import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const address = { municipality: 'Bantayan', province: 'Cebu', barangay: formData.barangay };
      await axios.post('/api/auth/register', { ...formData, address });
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input name="firstName" placeholder="First Name" onChange={onChange} required />
        <input name="middleName" placeholder="Middle Name" onChange={onChange} />
        <input name="lastName" placeholder="Last Name" onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" onChange={onChange} required />
        <input name="phone" placeholder="Phone" onChange={onChange} required />
        <select name="barangay" onChange={onChange} required>
          <option value="">Select Barangay</option>
          {barangays.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <input name="password" type="password" placeholder="Password" onChange={onChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;