'use client'
import { useEffect } from "react";
import styles from "./page.module.css";
import ForumDataFetch from "@/component/forumDataFetch";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
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
    <div>
      <div className={styles.container}>
          <ForumDataFetch/>
      </div>
    </div>
  );
}
ForumPage;
