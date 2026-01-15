import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';
import styles from './Notifications.module.css';

const Notifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      await axios.post('/api/notifications/subscribe', { subscription });
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
    }
  }, [publicKey]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        subscribeToPush();
      }
    }
  }, [subscribeToPush]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchPublicKey();
    }
  }, [token]);

  useEffect(() => {
    if (publicKey) {
      requestNotificationPermission();
    }
  }, [publicKey, requestNotificationPermission]);

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

  const fetchPublicKey = async () => {
    try {
      const res = await axios.get('/api/notifications/public-key');
      setPublicKey(res.data.key);
    } catch (err) {
      console.error('Failed to fetch public key:', err);
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