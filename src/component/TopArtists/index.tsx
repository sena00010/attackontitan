import React from 'react';
import styles from './TopArtists.module.css';

const TopArtists = () => {
    const artists = [
        {
            id: 1,
            name: 'Vinne',
            followers: '102.1k',
            posts: 112,
            avatar: '/path-to-avatar.jpg'
        },
        {
            id: 2,
            name: 'Orangesekaii',
            followers: '81.1k',
            posts: 500,
            avatar: '/path-to-avatar.jpg'
        },
        {
            id: 3,
            name: '河CY',
            followers: '440.7k',
            posts: 14,
            avatar: '/path-to-avatar.jpg'
        },
        {
            id: 4,
            name: 'くつか',
            followers: '198.1k',
            posts: 850,
            avatar: '/path-to-avatar.jpg'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>TOP ARTISTS</h3>
                <a href="#" className={styles.viewAll}>All</a>
            </div>

            <div className={styles.artistsList}>
                {artists.map(artist => (
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
                    src="/path-to-featured-image.jpg"
                    alt="Featured post"
                    className={styles.featuredImage}
                />
            </div>
        </div>
    );
};


export default TopArtists;