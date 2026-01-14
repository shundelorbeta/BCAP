import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaFileAlt, FaUsers, FaUserPlus, FaCheck } from 'react-icons/fa';
import styles from './Admin.module.css';

const barangays = [
  'Atop-atop', 'Baigad', 'Bantigue(Poblacion)', 'Baod', 'Binaobao(Poblacion)', 'Botigues', 'Doong', 'Guiwanon', 'Hilotongan', 'Kabac', 'Kabangbang', 'Kampingganon', 'Kangkaibe', 'Lipayran', 'Luyongbaybay', 'Mojon', 'Obo-ob', 'Patao', 'Putian', 'Sillon', 'Suba(Poblacion)', 'Sulangan', 'Sungko', 'Tamiao', 'Ticad(poblacion)'
];

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [responseData, setResponseData] = useState({ text: '', statusUpdate: '', images: null });
  const [coAdminData, setCoAdminData] = useState({ email: '', assignedBarangays: [] });
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'co-admin')) {
      fetchPosts();
      if (user.role === 'admin') fetchUsers();
    }
  }, [user]);

  const fetchPosts = async (barangay = '') => {
    const res = await axios.get(`/api/admin/posts?barangay=${barangay}`);
    setPosts(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  const verifyUser = async id => {
    await axios.put(`/api/admin/users/${id}/verify`);
    fetchUsers();
  };

  const respondToPost = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('text', responseData.text);
    data.append('statusUpdate', responseData.statusUpdate);
    if (responseData.images) {
      for (let i = 0; i < responseData.images.length; i++) {
        data.append('images', responseData.images[i]);
      }
    }
    await axios.post(`/api/admin/posts/${selectedPost._id}/respond`, data);
    fetchPosts();
    setSelectedPost(null);
  };

  const addCoAdmin = async e => {
    e.preventDefault();
    await axios.post('/api/admin/co-admin', coAdminData);
    alert('Co-admin added');
  };

  return (
    <div className={styles.admin}>
      <div className={styles.sidebar}>
        <div className={`${styles.navItem} ${activeTab === 'posts' ? styles.active : ''}`} onClick={() => setActiveTab('posts')}>
          <FaFileAlt /> Posts
        </div>
        {user && user.role === 'admin' && (
          <>
            <div className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>
              <FaUsers /> Users
            </div>
            <div className={`${styles.navItem} ${activeTab === 'co-admin' ? styles.active : ''}`} onClick={() => setActiveTab('co-admin')}>
              <FaUserPlus /> Co-Admins
            </div>
          </>
        )}
      </div>
      <div className={styles.main}>
        {activeTab === 'posts' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Posts</h2>
            <select className={styles.filterSelect} onChange={e => fetchPosts(e.target.value)}>
              <option value="">All Barangays</option>
              {barangays.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {posts.map(post => (
              <div key={post._id} className={styles.card}>
                <p><strong>{post.user.firstName} {post.user.lastName}</strong> from {post.barangay}</p>
                <p>{post.caption}</p>
                {post.images.map(img => <img key={img} src={`http://localhost:5000/${img}`} alt="" width="100" />)}
                <button className={styles.btn} onClick={() => setSelectedPost(post)}>Respond</button>
              </div>
            ))}
            {selectedPost && (
              <div className={styles.form}>
                <h3>Respond to Post</h3>
                <form onSubmit={respondToPost}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="responseText">Response</label>
                    <textarea className={styles.textarea} id="responseText" name="text" onChange={e => setResponseData({ ...responseData, text: e.target.value })} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="statusUpdate">Status Update</label>
                    <select className={styles.select} id="statusUpdate" name="statusUpdate" onChange={e => setResponseData({ ...responseData, statusUpdate: e.target.value })}>
                      <option value="">Select Status</option>
                      <option value="in progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="responseImages">Upload Images</label>
                    <input className={styles.input} id="responseImages" type="file" multiple onChange={e => setResponseData({ ...responseData, images: e.target.files })} />
                  </div>
                  <button className={styles.submitBtn} type="submit">Submit Response</button>
                </form>
              </div>
            )}
          </div>
        )}
        {activeTab === 'users' && user.role === 'admin' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Unverified Users</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className={styles.td}>{u.firstName} {u.lastName}</td>
                    <td className={styles.td}>{u.email}</td>
                    <td className={styles.td}>
                      <button className={styles.btn} onClick={() => verifyUser(u._id)}><FaCheck /> Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'co-admin' && user.role === 'admin' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Add Co-Admin</h2>
            <div className={styles.form}>
              <form onSubmit={addCoAdmin}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="coAdminEmail">Email</label>
                  <input className={styles.input} id="coAdminEmail" name="email" type="email" onChange={e => setCoAdminData({ ...coAdminData, email: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="assignedBarangays">Assigned Barangays</label>
                  <select className={styles.select} id="assignedBarangays" multiple onChange={e => setCoAdminData({ ...coAdminData, assignedBarangays: Array.from(e.target.selectedOptions, o => o.value) })}>
                    {barangays.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <button className={styles.submitBtn} type="submit">Add Co-Admin</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;