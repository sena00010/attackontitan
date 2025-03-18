"use client";
import ArtistSuggestions from "@/component/ArtistSuggestions";
import Navbar from "@/component/Navbar";
import PopularPosts from "@/component/PopularPosts";
import TopArtists from "@/component/TopArtists";
import { MantineProvider } from "@mantine/core";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";
import styles from "./sharedLayout.module.css";

const inter = Inter({ subsets: ["latin"] });

const firebaseConfig = {
  apiKey: "AIzaSyBrCP4cdAO3iugcXw_3tC-P7Tc6ejaHcn4",
  authDomain: "animepression.firebaseapp.com",
  databaseURL:
    "https://animepression-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "animepression",
  storageBucket: "animepression.appspot.com",
  messagingSenderId: "443513559646",
  appId: "1:443513559646:web:b9876ea8b060b6aa82b2cf",
  measurementId: "G-Z2X190YYL9",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current page is login or register
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if ((user && pathname === "/login") || pathname === "/") {
        router.push("/forum");
      } else if (!user && pathname !== "/login" && pathname !== "/register") {
        router.push("/login");
      }
    });
  }, [auth, router, pathname]);

  useEffect(() => {
    // Remove the cz-shortcut-listen attribute from the body element
    document.body.removeAttribute("cz-shortcut-listen");
  }, []);

  return (
    <html lang="en">
    <head>
      <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap"
          rel="stylesheet"
      />
    </head>
      <body className={inter.className}>
        <MantineProvider withCssVariables withGlobalClasses withStaticClasses>
          {isAuthPage ? (
            <div className={styles.authPageContainer}>
              <div className={styles.authInnerContainer}>{children}</div>
            </div>
          ) : (
            <div className={styles.pageContainer}>
              <div className={styles.innerContainer}>
                <Navbar />
                <div className={styles.mainSection}>
                  <div className={styles.container}>
                    <div className={styles.leftPanel}>
                      <TopArtists />
                    </div>
                    <div className={styles.mainContent}>{children}</div>
                    <div className={styles.rightPanel}>
                      <div className={styles.rightPanelSection}>
                        <div className={styles.sectionHeader}>
                          <h3>POPULAR POSTS</h3>
                          <a href="#" className={styles.viewAllLink}>
                            All
                          </a>
                        </div>
                        <PopularPosts />
                      </div>
                      <div className={styles.rightPanelSection}>
                        <div className={styles.sectionHeader}>
                          <h3>ARTIST SUGGESTIONS</h3>
                          <a href="#" className={styles.viewAllLink}>
                            All
                          </a>
                        </div>
                        <ArtistSuggestions />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MantineProvider>
      </body>
    </html>
  );
}
