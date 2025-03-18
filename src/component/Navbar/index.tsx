import { app } from "@/app/layout";
import { userAtom } from "@/atoms/userAtoms";
import {
  faBell,
  faSearch,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation"; // added navigation imports
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter(); // for navigation
  const pathname = usePathname(); // current route for active link checking
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [user, setUser] = useAtom(userAtom);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imgError, setImgError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          console.log("Fetching user data for...", currentUser.uid);
          const userDoc = await getDoc(doc(db, "user", currentUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData);
            setUser({
              id: currentUser.uid,
              email: userData.email || "",
              userName: userData.userName || "",
              userLastName: userData.userLastName || "",
              userNickname: userData.userNickname || "",
              phone: userData.phone || "",
              birthday: userData.birthday || "",
              favoriteAnimes: userData.favoriteAnimes || "",
              favoriteMangas: userData.favoriteMangas || "",
              userHobbies: userData.userHobbies || "",
              userInfo: userData.userInfo || "",
              userProfilePictures: userData.userProfilePictures || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, auth, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileClick = () => {
    // new function to navigate to profile page
    router.push("/profile");
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImgError(true);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 300); // increased delay to allow smoother dropdown access
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <a href="/" className={styles.logo}>
            Animepression
          </a>
        </div>

        <div className={styles.navLinks}>
          <a
            href="/"
            className={`${styles.navLink} ${pathname === "/forum" ? styles.active : ""}`}
          >
            Feeds
          </a>
          <a
            href="/Nakama"
            className={`${styles.navLink} ${pathname === "/Nakama" ? styles.active : ""}`}
          >
            Nakama
          </a>
          <a
            href="/Otaku-Diary"
            className={`${styles.navLink} ${pathname === "/Otaku-Diary" ? styles.active : ""}`}
          >
            Otaku-Diary
          </a>
          <a
            href="/createYourCharacter"
            className={`${styles.navLink} ${pathname === "/createYourCharacter" ? styles.active : ""}`}
          >
            Create Your Character
          </a>
          <a
            href="/rooms"
            className={`${styles.navLink} ${pathname === "/rooms" ? styles.active : ""}`}
          >
            Messages
          </a>
        </div>

        <div className={styles.navActions}>
          <button className={styles.iconButton}>
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className={styles.iconButton}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <div
            className={styles.profileWrapper}
            onClick={handleProfileClick} // added onClick for navigating to profile
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.userProfile}>
              <span className={styles.username}>
                {user?.userNickname || "Guest"}
              </span>
              {imgError || !user?.userProfilePictures ? (
                <div className={styles.fallbackAvatar}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
              ) : (
                <img
                  src={user.userProfilePictures}
                  alt="User Profile"
                  className={styles.profileImage}
                  onError={handleImageError}
                />
              )}
            </div>
            {showDropdown && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
