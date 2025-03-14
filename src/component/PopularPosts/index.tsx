import React from 'react';
import styles from './popularPosts.module.css';

const PopularPosts = () => {
  const popularPosts = [
    {
      id: 1,
      image: '/path-to-post-image.jpg',
      userName: '秋赤音 | 悪魔 | 兎兎姫中'
    },
    {
      id: 2,
      image: '/path-to-post-image.jpg',
      userName: 'Kare'
    }
  ];

  return (
      <div className={styles.container}>
        {popularPosts.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.imageContainer}>
                <img
                    src={post.image || '/default-post-image.jpg'}
                    alt={`Popular post by ${post.userName}`}
                    className={styles.postImage}
                />
              </div>
              <div className={styles.postInfo}>
                <div className={styles.userAvatar}>
                  <img
                      src="/path-to-avatar.jpg"
                      alt="User avatar"
                      className={styles.avatarImage}
                  />
                </div>
                <div className={styles.userName}>{post.userName}</div>
              </div>
            </div>
        ))}
      </div>
  );
};

export default PopularPosts;