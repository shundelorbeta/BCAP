import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaTimes, FaHeart, FaFlag, FaPaperPlane } from 'react-icons/fa';
import styles from './Feed.module.css';

const barangays = [
  'Atop-atop', 'Baigad', 'Bantigue(Poblacion)', 'Baod', 'Binaobao(Poblacion)', 'Botigues', 'Doong', 'Guiwanon', 'Hilotongan', 'Kabac', 'Kabangbang', 'Kampingganon', 'Kangkaibe', 'Lipayran', 'Luyongbaybay', 'Mojon', 'Obo-ob', 'Patao', 'Putian', 'Sillon', 'Suba(Poblacion)', 'Sulangan', 'Sungko', 'Tamiao', 'Ticad(poblacion)'
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ caption: '', barangay: '', images: null });
  const [search, setSearch] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('');
  const [modalImage, setModalImage] = useState(null);
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
    <div className={styles.feed}>
      <div className={styles.sidebar}>
        <h3>Search & Filter</h3>
        <div className={styles.searchFilter}>
          <input className={styles.searchInput} type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className={styles.clearBtn} onClick={() => setSearch('')}><FaTimes /> Clear</button>
        </div>
        <div className={styles.searchFilter}>
          <select className={styles.filterSelect} value={barangayFilter} onChange={(e) => setBarangayFilter(e.target.value)}>
            <option value="">All Barangays</option>
            {barangays.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button className={styles.clearBtn} onClick={() => setBarangayFilter('')}><FaTimes /> Clear</button>
        </div>
      </div>
      <div className={styles.main}>
        <h2>Bantayan Community Feed</h2>
        {user && (
          <form className={styles.postForm} onSubmit={onSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="caption">Describe the issue</label>
              <textarea className={styles.textarea} id="caption" name="caption" onChange={onChange} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="barangay">Barangay</label>
              <select className={styles.select} id="barangay" name="barangay" onChange={onChange} required>
                <option value="">Select Barangay</option>
                {barangays.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="images">Upload Images</label>
              <input className={styles.fileInput} id="images" type="file" multiple onChange={onFileChange} />
            </div>
            <button className={styles.submitBtn} type="submit"><FaPaperPlane /> Post</button>
          </form>
        )}
        <div className={styles.postsGrid}>
          {posts.map(post => (
            <div key={post._id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <strong>{post.user.firstName} {post.user.lastName}</strong> from {post.barangay}
              </div>
              <div className={styles.postContent}>{post.caption}</div>
              {post.images.length > 0 && (
                <div className={styles.postImages}>
                  {post.images.map(img => <img key={img} className={styles.postImage} src={`http://localhost:5000/${img}`} alt="" onClick={() => setModalImage(img)} />)}
                </div>
              )}
              <div className={styles.postActions}>
                <span>Likes: {post.likes.length}</span>
                {user && <button className={styles.likeBtn} onClick={() => likePost(post._id)}><FaHeart /> Like</button>}
                {user && <button className={styles.reportBtn} onClick={() => reportPost(post._id)}><FaFlag /> Report</button>}
              </div>
              <div className={styles.responses}>
                <h4>Responses:</h4>
                {post.responses.map(resp => (
                  <div key={resp._id} className={styles.response}>
                    <p><strong>{resp.admin.firstName} {resp.admin.lastName}</strong>: {resp.text}</p>
                    {resp.images.length > 0 && (
                      <div className={styles.responseImages}>
                        {resp.images.map(img => <img key={img} className={styles.responseImage} src={`http://localhost:5000/${img}`} alt="" />)}
                      </div>
                    )}
                    <p>Status: {resp.statusUpdate}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalImage && (
        <div className={styles.modalOverlay} onClick={() => setModalImage(null)}>
          <div className={styles.modalContent}>
            <img className={styles.modalImage} src={`http://localhost:5000/${modalImage}`} alt="" />
            <button className={styles.closeBtn} onClick={() => setModalImage(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;