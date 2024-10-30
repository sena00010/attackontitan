"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./notifications.module.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/app/layout";
import { getAuth } from "firebase/auth";

interface NotificationPopoverProps {
  open: boolean;
  onToggle: () => void;
}
interface Notification {
  id: string;
  user_id: string;
  friend_id: string;
  friend?: { uid: string; userName: string };
  user?: { uid: string; userName: string };
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  open,
  onToggle,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(app);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const auth = getAuth(app);

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      onToggle();
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
  
      const notificationRef = collection(db, "notification");
      const friendQuery = query(notificationRef, where("friend_id", "==", userId));
      const userQuery = query(notificationRef, where("user_id", "==", userId));
  
      try {
        const [friendSnapshots, userSnapshots] = await Promise.all([
          getDocs(friendQuery),
          getDocs(userQuery),
        ]);
  
        const notificationsList = [
          ...friendSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          ...userSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ];
  
        const enrichedNotifications = await Promise.all(
          notificationsList.map(async (notification) => {
            const friendRef = doc(db, "user", notification.friend_id);
            const userRef = doc(db, "user", notification.user_id);
  
            const [friendDoc, userDoc] = await Promise.all([
              getDoc(friendRef),
              getDoc(userRef),
            ]);
  
            return {
              ...notification,
              friend: friendDoc.exists() ? friendDoc.data() : null,
              user: userDoc.exists() ? userDoc.data() : null,
            };
          })
        );
  
        // Veriyi state'e ve localStorage'a kaydediyoruz
        setNotifications(enrichedNotifications);
        localStorage.setItem("notifications", JSON.stringify(enrichedNotifications));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    // İlk yüklemede localStorage'dan veriyi çekiyoruz
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      fetchNotifications();
    }
  }, [db]);
  

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      {open && (
        <div className={styles.popoverContent}>
          {notifications.length > 0 ? (
            notifications.map((notification) =>
              notification.friend?.uid !== auth.currentUser?.uid ? (
                <div
                  key={notification.friend?.userName}
                  className={styles.notificationItem}
                >
                  <p className={styles.notificationText}>
                    {`${notification.friend?.userName} kişisine arkadaşlık isteği gönderdiniz.`}
                  </p>
                </div>
              ) : (
                <div
                  key={notification.user?.userName}
                  className={styles.notificationItem}
                >
                  <p className={styles.notificationText}>
                    {`${notification.user?.userName} kişisinden arkadaşlık isteği aldınız.`}
                  </p>
                  <button className={styles.acceptButton}>Kabul et</button>
                  <button className={styles.rejectButton}>Reddet</button>
                </div>
              )
            )
          ) : (
            <p className={styles.noNotificationText}>Hiç bildirim yok</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
