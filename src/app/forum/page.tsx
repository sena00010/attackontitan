'use client'

import { useEffect } from "react";
import styles from "./page.module.css";
import ForumDataFetch from "@/component/forumDataFetch";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import TopArtists from "@/component/TopArtists";
import PopularPosts from "@/component/PopularPosts";
import ArtistSuggestions from "@/component/ArtistSuggestions";
import Navbar from "@/component/Navbar";

export default function ForumPage() {
    const [user, setUser] = useAtom(userAtom);

    // Sayfa yüklendiğinde, localStorage'dan kullanıcıyı çek
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.innerContainer}>
                <Navbar />
                <div className={styles.mainSection}>
                    <div className={styles.container}>
                        <div className={styles.leftPanel}>
                            <TopArtists />
                        </div>
                        <div className={styles.mainContent}>
                            <ForumDataFetch />
                        </div>
                        <div className={styles.rightPanel}>
                            <div className={styles.rightPanelSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>POPULAR POSTS</h3>
                                    <a href="#" className={styles.viewAllLink}>All</a>
                                </div>
                                <PopularPosts />
                            </div>
                            <div className={styles.rightPanelSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>ARTIST SUGGESTIONS</h3>
                                    <a href="#" className={styles.viewAllLink}>All</a>
                                </div>
                                <ArtistSuggestions />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}