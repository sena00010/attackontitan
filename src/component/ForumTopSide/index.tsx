import React, { useEffect, useState } from 'react';
import styles from './forumTopSide.module.css';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms/userAtoms';
import NotificationPopover from '../notifications';

const ForumTopSide: React.FC<{ profilePicture: string }> = ({ profilePicture }) => {
  const [data, setData] = useAtom(userAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setData(JSON.parse(savedUser));
    }
  }, []);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>Animepression</div>
      <div className={styles.menu}>
        <a href="/profile" className={styles.menuItem}>
          <img src={data?.userProfilePictures || profilePicture} className={styles.profilePicture} />
        </a>
        <a href="/messages" className={styles.menuItem}>Messages</a>
        <a href="/logout" className={styles.menuItem}>Logout</a>
      </div>
      <div>
        <a href="/friendrequest" className={styles.menuItem}>find a new friend!</a>
      </div>
      <div>
        <button onClick={handleToggle} className={styles.notificationButton}>
          notifications
        </button>
        <NotificationPopover open={open} onToggle={handleToggle} />
      </div>
    </div>
  );
}

export default ForumTopSide;
