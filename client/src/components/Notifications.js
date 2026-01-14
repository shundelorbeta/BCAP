import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';
import styles from './Notifications.module.css';

const Notifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const notif of unread) {
      await markAsRead(notif._id);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.notifications}>
      <button className={styles.bellBtn} onClick={toggleDropdown}>
        <FaBell />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : notifications.length === 0 ? (
            <p className={styles.noNotifications}>No notifications</p>
          ) : (
            notifications.map(notif => (
              <div
                key={notif._id}
                className={`${styles.notificationItem} ${!notif.isRead ? styles.unread : ''}`}
                onClick={() => markAsRead(notif._id)}
              >
                <p className={styles.title}>
                  {notif.relatedPost ? notif.relatedPost.caption : 'Post'}
                </p>
                <p className={styles.message}>{notif.message}</p>
                <small className={styles.timestamp}>
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;