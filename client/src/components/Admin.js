import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const barangays = [
  'Atop-atop', 'Baigad', 'Bantigue(Poblacion)', 'Baod', 'Binaobao(Poblacion)', 'Botigues', 'Doong', 'Guiwanon', 'Hilotongan', 'Kabac', 'Kabangbang', 'Kampingganon', 'Kangkaibe', 'Lipayran', 'Luyongbaybay', 'Mojon', 'Obo-ob', 'Patao', 'Putian', 'Sillon', 'Suba(Poblacion)', 'Sulangan', 'Sungko', 'Tamiao', 'Ticad(poblacion)'
];

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [responseData, setResponseData] = useState({ text: '', statusUpdate: '', images: null });
  const [coAdminData, setCoAdminData] = useState({ email: '', assignedBarangays: [] });
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
    <div>
      <h2>Admin Dashboard</h2>
      <select onChange={e => fetchPosts(e.target.value)}>
        <option value="">All Barangays</option>
        {barangays.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      {user && user.role === 'admin' && (
        <>
          <h3>Unverified Users</h3>
          {users.map(u => (
            <div key={u._id}>
              {u.firstName} {u.lastName} - {u.email}
              <button onClick={() => verifyUser(u._id)}>Verify</button>
            </div>
          ))}
          <h3>Add Co-Admin</h3>
          <form onSubmit={addCoAdmin}>
            <input name="email" placeholder="Email" onChange={e => setCoAdminData({ ...coAdminData, email: e.target.value })} required />
            <select multiple onChange={e => setCoAdminData({ ...coAdminData, assignedBarangays: Array.from(e.target.selectedOptions, o => o.value) })}>
              {barangays.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <button type="submit">Add</button>
          </form>
        </>
      )}
      <h3>Posts</h3>
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p>{post.caption}</p>
          <button onClick={() => setSelectedPost(post)}>Respond</button>
        </div>
      ))}
      {selectedPost && (
        <form onSubmit={respondToPost}>
          <textarea name="text" placeholder="Response" onChange={e => setResponseData({ ...responseData, text: e.target.value })} required />
          <select name="statusUpdate" onChange={e => setResponseData({ ...responseData, statusUpdate: e.target.value })}>
            <option value="">Select Status</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <input type="file" multiple onChange={e => setResponseData({ ...responseData, images: e.target.files })} />
          <button type="submit">Submit Response</button>
        </form>
      )}
    </div>
  );
};

export default Admin;