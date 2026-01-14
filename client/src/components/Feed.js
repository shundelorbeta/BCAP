import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const barangays = [
  'Atop-atop', 'Baigad', 'Bantigue(Poblacion)', 'Baod', 'Binaobao(Poblacion)', 'Botigues', 'Doong', 'Guiwanon', 'Hilotongan', 'Kabac', 'Kabangbang', 'Kampingganon', 'Kangkaibe', 'Lipayran', 'Luyongbaybay', 'Mojon', 'Obo-ob', 'Patao', 'Putian', 'Sillon', 'Suba(Poblacion)', 'Sulangan', 'Sungko', 'Tamiao', 'Ticad(poblacion)'
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ caption: '', barangay: '', images: null });
  const [search, setSearch] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts(search, barangayFilter);
  }, [search, barangayFilter]);

  const fetchPosts = async (searchParam = '', barangayParam = '') => {
    const params = new URLSearchParams();
    if (searchParam) params.append('search', searchParam);
    if (barangayParam) params.append('barangay', barangayParam);
    const res = await axios.get(`/api/posts?${params.toString()}`);
    setPosts(res.data);
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = e => setFormData({ ...formData, images: e.target.files });

  const onSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('caption', formData.caption);
    data.append('barangay', formData.barangay);
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append('images', formData.images[i]);
      }
    }
    await axios.post('/api/posts', data);
    fetchPosts(search, barangayFilter);
  };

  const likePost = async id => {
    await axios.put(`/api/posts/${id}/like`);
    fetchPosts(search, barangayFilter);
  };

  const reportPost = async id => {
    await axios.post(`/api/posts/${id}/report`);
    alert('Post reported');
    fetchPosts(search, barangayFilter);
  };

  return (
    <div>
      <h2>Bantayan Community Feed</h2>
      <div>
        <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => setSearch('')}>Clear Search</button>
        <select value={barangayFilter} onChange={(e) => setBarangayFilter(e.target.value)}>
          <option value="">All Barangays</option>
          {barangays.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <button onClick={() => setBarangayFilter('')}>Clear Filter</button>
      </div>
      {user && (
        <form onSubmit={onSubmit}>
          <textarea name="caption" placeholder="Describe the issue" onChange={onChange} required />
          <select name="barangay" onChange={onChange} required>
            <option value="">Select Barangay</option>
            {barangays.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input type="file" multiple onChange={onFileChange} />
          <button type="submit">Post</button>
        </form>
      )}
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p><strong>{post.user.firstName} {post.user.lastName}</strong> from {post.barangay}</p>
          <p>{post.caption}</p>
          {post.images.map(img => <img key={img} src={`http://localhost:5000/${img}`} alt="" width="200" />)}
          <p>Likes: {post.likes.length}</p>
          {user && <button onClick={() => likePost(post._id)}>Like</button>}
          {user && <button onClick={() => reportPost(post._id)}>Report</button>}
          <h4>Responses:</h4>
          {post.responses.map(resp => (
            <div key={resp._id}>
              <p><strong>{resp.admin.firstName} {resp.admin.lastName}</strong>: {resp.text}</p>
              {resp.images.map(img => <img key={img} src={`http://localhost:5000/${img}`} alt="" width="200" />)}
              <p>Status: {resp.statusUpdate}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Feed;