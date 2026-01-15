import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ firstName: '', middleName: '', lastName: '', email: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [navigate, user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedName = `${profile.firstName} ${profile.lastName}`;
      if (updatedName !== user.name) {
        login(localStorage.getItem('token'), { ...user, name: updatedName });
      }
      setEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.profile}>
      <h2>My Profile</h2>
      {!editing ? (
        <div>
          <p><strong>Name:</strong> {profile.firstName} {profile.middleName ? profile.middleName + ' ' : ''}{profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio || 'No bio added yet.'}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Middle Name</label>
            <input type="text" name="middleName" value={profile.middleName} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Tell us about yourself..." />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;