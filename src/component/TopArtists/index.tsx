import styles from "./TopArtists.module.css";

const TopArtists = () => {
  const artists = [
    {
      id: 1,
      name: "Vinne",
      followers: "102.1k",
      posts: 112,
      avatar:
        "https://i.pinimg.com/736x/9a/4d/bd/9a4dbde73a2e2b0ec7b70c613e522e57.jpg",
    },
    {
      id: 2,
      name: "Orangesekaii",
      followers: "81.1k",
      posts: 500,
      avatar:
        "https://wallpapers.com/images/hd/anime-profile-picture-tebfn1alembbzoqw.jpg",
    },
    {
      id: 3,
      name: "河CY",
      followers: "440.7k",
      posts: 14,
      avatar:
        "http://m.gettywallpapers.com/wp-content/uploads/2023/09/Black-Anime-Characters-pfp.jpg",
    },
    {
      id: 4,
      name: "くつか",
      followers: "198.1k",
      posts: 850,
      avatar:
        "https://media.baamboozle.com/uploads/images/265422/835df7b6-8ca1-4450-b749-b75d6842aea9-thumbnail.jpeg",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>TOP ARTISTS</h3>
        <a href="#" className={styles.viewAll}>
          All
        </a>
      </div>

      <div className={styles.artistsList}>
        {artists.map((artist) => (
          <div key={artist.id} className={styles.artistCard}>
            <div className={styles.avatarContainer}>
              <img
                src={artist.avatar || `/defaultProfile.png`}
                alt={artist.name}
                className={styles.avatar}
              />
            </div>
            <div className={styles.artistInfo}>
              <h4 className={styles.artistName}>{artist.name}</h4>
              <p className={styles.artistStats}>
                {artist.followers} Followers
                <span className={styles.dot}>•</span>
                {artist.posts} Post
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.featuredPost}>
        {/* Featured artist post with image */}
        <img
          src="https://theserialbinger.com/wp-content/uploads/2022/02/Aesthetic-Anime-pfp.jpg"
          alt="Featured post"
          className={styles.featuredImage}
        />
      </div>
    </div>
  );
};

export default TopArtists;
