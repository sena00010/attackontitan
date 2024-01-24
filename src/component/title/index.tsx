"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./title.module.css";

export default function TitleComp() {
  const router = useRouter();
  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/login");
  };
  return (
    <div className={styles.app}>
      <div className={styles.navbar}>
        <div>
          <a href="#" className={styles.brand}>
            ATTACK ON TİTAN
          </a>
        </div>
        <div className={styles.nav}>
          <a href="#" className={styles.navItem}>
            Anasayfa
          </a>
          <a href="#" className={styles.navItem}>
            Karakter Baskılı Ürünler
          </a>
          <a href="#" className={styles.navItem}>
            Hakkımızda
          </a>
          <a href="#" className={styles.navItem}>
            İletişim
          </a>
          <a href="#" className={styles.navItem}>
            Sepetim
          </a>
          <a href="../forum/" className={styles.navItem}>
            Forum
          </a>
          <button onClick={handleClick} className={styles.loginButton}>
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}
TitleComp;
