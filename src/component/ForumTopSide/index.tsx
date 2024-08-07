import React from 'react';
import styles from './forumTopSide.module.css';

const ForumTopSide = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>Animepression</div>
      <div className={styles.menu}>
        <a href="/profile"  className={styles.menuItem}>Profile</a>
        <a href="/messages" className={styles.menuItem}>Messages</a>
        <a href="/logout" className={styles.menuItem}>Logout</a>
      </div>
    </div>
  );
}

export default ForumTopSide;
