"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./notifications.module.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
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
  const [notif, setNotif] = useState<Notification[]>([]);
  const auth = getAuth(app);

  console.log(notif, 'notif');

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      onToggle();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const notificationRef = collection(db, "notification");
      try {
        const getNotifications = await getDocs(notificationRef);
        const notificationsList = getNotifications.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userPromises = notificationsList.map(async (notif) => {
          const friendRef = doc(db, "user", notif.friend_id);
          const userRef = doc(db, "user", notif.user_id);

          const [friendDoc, userDoc] = await Promise.all([
            getDoc(friendRef),
            getDoc(userRef),
          ]);
          return {
            ...notif,
            friend: friendDoc.exists() ? friendDoc.data() : null,
            user: userDoc.exists() ? userDoc.data() : null,
          };
        });

        const notificationsWithUsers = await Promise.all(userPromises);

        setNotif(notificationsWithUsers);
        console.log(notificationsWithUsers, "bildirimler ve kullanıcılar");
      } catch (error) {
        console.error("Veriler çekilirken bir hata oluştu:", error);
      }
    };

    fetchUserData();
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

  const userId = auth.currentUser?.uid;

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      {open && (
        <div className={styles.popoverContent}>
          {notif.length > 0 ? (
            notif.map((notification) => (
              notification.friend?.uid !== userId ? (
                <div key={notification.friend?.userName} className={styles.notificationItem}>
                  <p className={styles.notificationText}>{`${notification.friend?.userName} kişisine arkadaşlık isteği gönderdiniz.`}</p>
                </div>
              ) : (
                <div key={notification.user?.userName} className={styles.notificationItem}>
                  <p className={styles.notificationText}>{`${notification.user?.userName} kişisinden arkadaşlık isteği aldınız.`}</p>
                  <button className={styles.acceptButton}>Kabul et</button>
                  <button className={styles.rejectButton}>Reddet</button>
                </div>
              )
            ))
          ) : (
            <p className={styles.noNotificationText}>Hiç bildirim yok</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
