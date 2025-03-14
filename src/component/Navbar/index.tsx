import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";

const Navbar = () => {
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <a href="/" className={styles.logo}>Animepression</a>
                </div>

                <div className={styles.navLinks}>
                    <a href="/community" className={`${styles.navLink} ${styles.active}`}>Community</a>
                    <a href="/collection" className={styles.navLink}>Collection</a>
                    <a href="/explore" className={styles.navLink}>Explore</a>
                    <a href="/bookmarks" className={styles.navLink}>Bookmarks</a>
                </div>

                <div className={styles.navActions}>
                    <button className={styles.iconButton}>
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button className={styles.iconButton}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <div className={styles.userProfile}>
                        <span className={styles.username}>evannn96</span>
                        <img
                            src={user?.userProfilePictures || "/defaultProfile.png"}
                            alt="User Profile"
                            className={styles.profileImage}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;