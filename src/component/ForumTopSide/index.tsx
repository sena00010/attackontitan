import React, { useEffect } from 'react';
import styles from './forumTopSide.module.css';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms/userAtoms';

const ForumTopSide = ({ profilePicture }: any) => {
  const [data, setData] = useAtom(userAtom);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setData(JSON.parse(savedUser));
    }
  }, []);

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
    </div>
  );
}

export default ForumTopSide;
