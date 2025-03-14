import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ArtistSuggestions.module.css";

const ArtistSuggestions = () => {
  const suggestedArtists = [
    {
      id: 1,
      name: "Kayorin",
      followers: "305.3k",
      avatar:
        "https://c4.wallpaperflare.com/wallpaper/267/1003/664/anime-girls-headphones-original-characters-profile-wallpaper-preview.jpg",
      posts: "1k2",
    },
    {
      id: 2,
      name: "Orangesekaii",
      followers: "81.1k",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIlQMXEbWBqEq4JUJeYRSlVNsjepN-cxD6Kg&s",
      posts: "500",
    },
    {
      id: 3,
      name: "つか",
      followers: "198.1k",
      avatar:
        "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/317417433/original/e99a2137a51b1c5ed84820e1bb306ed2a9922558/illustrate-front-view-anime-characters.jpg",
      posts: "1k",
    },
    {
      id: 4,
      name: "Uya/mochipanko",
      followers: "195.2k",
      avatar:
        "https://scontent.fist4-1.fna.fbcdn.net/v/t1.6435-9/117381852_3231333466944506_5686896525029737252_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=DyFcom31aMgQ7kNvgEuFlM2&_nc_oc=Adg4M6L6yV-bYw5JgculEuNNggIjVlg1aBsRDki_3gczLhITS5EDAERM8kZj_xBIPUvYaiguWFYeFN1ZYpUkvtvr&_nc_zt=23&_nc_ht=scontent.fist4-1.fna&_nc_gid=ACzbfBgBDWaPxEPNWZ1Qa8D&oh=00_AYEOfp0BRwiP6MkgdyT4laEvLKBRMQXHT2L6FvxnbjT98g&oe=67FBDBD8",
      posts: "800",
    },
  ];

  return (
    <div className={styles.container}>
      {suggestedArtists.map((artist) => (
        <div key={artist.id} className={styles.artistCard}>
          <div className={styles.artistInfo}>
            <div className={styles.avatarContainer}>
              <img
                src={artist.avatar || "/default-avatar.jpg"}
                alt={artist.name}
                className={styles.avatar}
              />
            </div>
            <div className={styles.artistDetails}>
              <h5 className={styles.artistName}>{artist.name}</h5>
              <p className={styles.followerCount}>
                {artist.followers} Followers
              </p>
              <p className={styles.postCount}>{artist.posts} Posts</p>
            </div>
          </div>
          <button className={styles.followButton}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ArtistSuggestions;
