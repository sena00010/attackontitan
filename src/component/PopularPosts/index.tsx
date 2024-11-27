import React from 'react'
import styles from "./popularPosts.module.css";

const PopularPosts = () => {
  return (
    <div><div className={styles.container}>
    <div className={styles.popularPosts}>
      <h3 className={styles.title}>Popular Posts</h3>
      <div className={styles.item}>
        <div className={styles.thumbnail}></div>
        <div className={styles.details}>Some popular post title</div>
      </div>
    </div>
    <div className={styles.artistSuggestions}>
      <h3 className={styles.title}>Artist Suggestions</h3>
      <div className={styles.item}>
        <div className={styles.thumbnail}></div>
        <div className={styles.details}>Some artist name</div>
      </div>
    </div>
  </div>
  </div>
  )
}

export default PopularPosts