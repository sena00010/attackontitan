import React from "react";
import Link from "next/link";
import styles from "./title.module.css";

export default function TitleComp() {
  return (
      <div className={styles.app}>
        <div className={styles.navbar}>
          <div>
            <Link href="/" passHref>
              <span className={styles.brand}>
                ATTACK ON TİTAN
                            </span>

            </Link>
          </div>
          <div className={styles.nav}>
            <Link href="/" passHref>
              <span className={styles.navItem}>
                Anasayfa
                            </span>

            </Link>
            <Link href="/productList" passHref>
              <span className={styles.navItem}>
                Karakter Baskılı Ürünler
                            </span>

            </Link>
            <Link href="/about" passHref>
              <span className={styles.navItem}>
                Hakkımızda
              </span>
            </Link>
            <Link href="/contact" passHref>
              <span className={styles.navItem}>
                İletişim
                            </span>

            </Link>
            <Link href="/cartPage" passHref>
              <span className={styles.navItem}>
                Sepetim
                            </span>

            </Link>
            <Link href="/forum" passHref>
              <span className={styles.navItem}>
                Forum
              </span>
            </Link>
            <Link href="/login" passHref>
              <span className={styles.loginButton}>
                Giriş Yap
                            </span>

            </Link>
          </div>
        </div>
      </div>
  );
}
