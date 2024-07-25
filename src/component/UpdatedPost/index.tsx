import React, { useState, useEffect } from 'react';
import styles from './updated.module.css';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { app } from '@/app/layout';

const UpdatedPost = ({ open, data, setOpenUpdate, setPost, selectedPost }:any) => {
  const db = getFirestore(app);
  const [postContent, setPostContent] = useState({ text: '', image: '' });
console.log(setPost,"setPost")
console.log(setOpenUpdate,"setOpenUpdate")
  useEffect(() => {
    if (selectedPost) {
      setPostContent({
        text: selectedPost.postContent.text || '',
        image: selectedPost.postContent.image || '',
      });
    }
  }, [selectedPost]);

  if (!open) return null;

  const handleUpdate = async () => {
    if (selectedPost) {
      const postRef = doc(db, "post", selectedPost.id);
      await updateDoc(postRef, {
        postContent: postContent
      });
      setOpenUpdate(false);
      const updatedPosts = await data();
      setPost(updatedPosts);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
      <form className={styles.form}>
        <input
            className={styles.textAreaInput}
            value={postContent.text}
          onChange={(e) => setPostContent({ ...postContent, text: e.currentTarget.value })}
        />
        <input
            className={styles.textAreaInput}
            value={postContent.image}
          onChange={(e) => setPostContent({ ...postContent, image: e.currentTarget.value })}
        />
        </form>
        <button className={styles.submitButton} onClick={handleUpdate}>Güncellemeyi Kaydet</button>
      </div>
    </div>
  );
};

export default UpdatedPost;
