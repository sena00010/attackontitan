import styles from "./popularPosts.module.css";

const PopularPosts = () => {
  const popularPosts = [
    {
      id: 1,
      image:
        "https://api.duniagames.co.id/api/content/upload/file/5920353761622457395.jpg",
      userName: "秋赤音 | 悪魔 | 兎兎姫中",
    },
    {
      id: 2,
      image:
        "https://cdn.myanimelist.net/images/about_me/main_visual/9524538-187090b3-392c-436b-b66e-28bd852d09bf.jpg?t=1728767851",
      userName: "Kare",
    },
  ];

  return (
    <div className={styles.container}>
      {popularPosts.map((post) => (
        <div key={post.id} className={styles.postCard}>
          <div className={styles.imageContainer}>
            <img
              src={post.image || "/default-post-image.jpg"}
              alt={`Popular post by ${post.userName}`}
              className={styles.postImage}
            />
          </div>
          <div className={styles.postInfo}>
            <div className={styles.userAvatar}>
              <img
                src="https://avatarfiles.alphacoders.com/610/thumb-1920-61011.gif"
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
