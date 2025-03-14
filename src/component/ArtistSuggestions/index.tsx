import React from 'react';
import styles from './ArtistSuggestions.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ArtistSuggestions = () => {
    const suggestedArtists = [
        {
            id: 1,
            name: 'Kayorin',
            followers: '305.3k',
            avatar: '/path-to-avatar.jpg'
        },
        {
            id: 2,
            name: 'Orangesekaii',
            followers: '81.1k',
            avatar: '/path-to-avatar.jpg'
        },
        {
            id: 3,
            name: 'つか',
            followers: '198.1k',
            avatar: '/path-to-avatar.jpg'
        },
        {
            id: 4,
            name: 'Uya/mochipanko',
            followers: '195.2k',
            avatar: '/path-to-avatar.jpg'
        }
    ];

    return (
        <div className={styles.container}>
            {suggestedArtists.map(artist => (
                <div key={artist.id} className={styles.artistCard}>
                    <div className={styles.artistInfo}>
                        <div className={styles.avatarContainer}>
                            <img
                                src={artist.avatar || '/default-avatar.jpg'}
                                alt={artist.name}
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.artistDetails}>
                            <h5 className={styles.artistName}>{artist.name}</h5>
                            <p className={styles.followerCount}>{artist.followers} Followers</p>
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