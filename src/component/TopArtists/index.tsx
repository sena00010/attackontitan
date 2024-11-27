import styles from "./TopArtists.module.css";

export default function TopArtists() {
  const artists = [
    { name: "Vinne", followers: "102.1k", posts: 112 },
    { name: "Orangesekaii", followers: "81.1k", posts: 500 },
    { name: "河CY", followers: "440.7k", posts: 1000 },
    { name: "つか", followers: "198.1k", posts: 850 },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Top Artists</h2>
      <ul className={styles.list}>
        {artists.map((artist, index) => (
          <li key={index} className={styles.artist}>
            <div className={styles.avatar}></div>
            <div>
              <p className={styles.name}>{artist.name}</p>
              <p className={styles.details}>
                {artist.followers} Followers · {artist.posts} Posts
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
