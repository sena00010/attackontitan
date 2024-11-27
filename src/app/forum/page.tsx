'use client'
import { useEffect } from "react";
import styles from "./page.module.css";
import ForumDataFetch from "@/component/forumDataFetch";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import TopArtists from "@/component/TopArtists";
import PopularPosts from "@/component/PopularPosts";
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
    <div className={styles.container}>
       <div className={styles.leftPanel}>
        <TopArtists />
      </div>
      <div className={styles.mainContent}>
        <ForumDataFetch />
      </div>
      <div className={styles.rightPanel}>
        <PopularPosts />
      </div>
      
    </div>
  );
}
ForumPage;
