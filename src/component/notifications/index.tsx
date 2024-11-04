"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./notifications.module.css";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  deleteDoc,
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
  const [notList, setNotList] = useState<any>([]);

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      onToggle();
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      try {
        const notificationsRef = collection(db, "user", userId, "notification");
        console.log(notificationsRef, 'notificationsRef');
        const notificationsSnapshot = await getDocs(notificationsRef);

        const notificationsList = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setNotList(notificationsList);

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
              friend: friendDoc.exists() ? { uid: friendDoc.id, ...friendDoc.data() } : null,
              user: userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } : null,
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
      fetchNotifications(); // Burada fetchNotifications çağrılıyor
    }
  }, [db, auth.currentUser]); // Bağımlılıklara auth.currentUser eklendi

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

  const requestAccept = async (notificationId: string, senderId: string) => {
    const userId = auth.currentUser?.uid;
    console.log(userId, 'userId');
    console.log(senderId, 'senderId');
    if (!userId) {
      console.error("Kullanıcı oturumu açık değil.");
      return;
    }

    try {
      // İlk olarak kendi friends koleksiyonuna arkadaş kaydını ekle
      await addDoc(collection(db, "user", userId, "friends"), {
        friend_id: senderId,
        user_id: userId,
        created_at: new Date(),
      });

      // Gönderenin friends koleksiyonuna arkadaş kaydını ekle
      await addDoc(collection(db, "user", senderId, "friends"), {
        friend_id: userId,
        user_id: senderId,
        created_at: new Date(),
      });

      // Bildirimi kullanıcının notifications alt koleksiyonundan sil
      const notificationRef = doc(db, "user", userId, "notification", notificationId);
      await deleteDoc(notificationRef);

      console.log("Arkadaşlık isteği başarıyla kabul edildi ve kaydedildi.");
    } catch (error) {
      console.error("Arkadaşlık isteği kabul edilirken hata oluştu:", error);
    }
  };

  console.log(notifications, 'notifications');
  console.log(notList, 'notList');

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      {open && (
        <div className={styles.popoverContent}>
          {notifications.length > 0 ? (
            notifications.map((notification) =>
              notification.user?.uid !== auth.currentUser?.uid ? (
                <div className={styles.notificationItem} key={notification.id}>
                  <p className={styles.notificationText}>
                    {`${notification.user?.userName} kişisine arkadaşlık isteği gönderdiniz.`}
                  </p>
                </div>
              ) : (
                <div className={styles.notificationItem} key={notification.id}>
                  <p className={styles.notificationText}>
                    {`${notification.friend?.userName} kişisinden arkadaşlık isteği aldınız.`}
                  </p>
                  <button
                    className={styles.acceptButton}
                    onClick={() => requestAccept(notification.id, notification.friend_id)}
                  >
                    Kabul et
                  </button>
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
