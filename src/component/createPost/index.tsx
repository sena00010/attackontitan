import React from 'react';
import styles from './createPost.module.css';

interface PostCreatedProps {
  opened: boolean;
}

const PostCreated: React.FC<PostCreatedProps> = ({ opened }) => {
  if (!opened) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <form className={styles.form} action="">
          <input className={styles.textAreaInput} type="text" placeholder='Ne paylaşmak istersiniz?' />
          <input className={styles.textAreaInput} type="text" placeholder='Paylaşmak istediğiniz fotoğrafın linkini ekler misiniz?' />
          <button className={styles.submitButton} type="submit">Gönder</button>
        </form>
      </div>
    </div>
  );
};

export default PostCreated;
