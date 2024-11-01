import "firebase/auth";
import { getAuth } from "firebase/auth"; // Import getAuth
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { userAtom } from "../../atoms/userAtoms";
import NotificationPopover from "../notifications";
import styles from "./forumTopSide.module.css";

const ForumTopSide: React.FC<{ profilePicture: string }> = ({
  profilePicture,
}) => {
  const [data, setData] = useAtom(userAtom);
  const [open, setOpen] = useState(false);
  const auth = getAuth(); // Get the auth instance

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setData(JSON.parse(savedUser));
    }
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>Animepression</div>
      <div className={styles.menu}>
        <a href="/profile" className={styles.menuItem}>
          <img
            src={data?.userProfilePictures || profilePicture}
            className={styles.profilePicture}
          />
        </a>
        <a href="/rooms" className={styles.menuItem}>
          Messages
        </a>

        <a
          href="#"
          className={styles.menuItem}
          onClick={async (e) => {
            e.preventDefault();
            try {
              await auth.signOut();
              localStorage.clear();
              window.location.href = "/login";
            } catch (error) {
              console.error("Error logging out: ", error);
            }
          }}
        >
          Logout
        </a>
      </div>
      <div>
        <a href="/friendrequest" className={styles.menuItem}>
          find a new friend!
        </a>
      </div>
      <div>
        <button onClick={handleToggle} className={styles.notificationButton}>
          notifications
        </button>
        <NotificationPopover open={open} onToggle={handleToggle} />
      </div>
    </div>
  );
};

export default ForumTopSide;
