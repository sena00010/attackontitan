'use client'
import React, { useEffect, useState } from "react";
import { app } from "../../app/layout";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./page.module.css";

const Rooms = () => {
  const [data, setData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Kullanıcı ID'sini saklamak için state ekledik
  const db = getFirestore(app);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid); // Kullanıcının UID'sini state'e kaydet
      } else {
        setCurrentUserId(null); // Kullanıcı oturumu yoksa null yap
      }
    });

    return () => unsubscribe(); // Bellek sızıntılarını önlemek için aboneliği temizle
  }, [auth]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUserId) return; // Kullanıcı ID'si yoksa sorguyu çalıştırma

      try {
        const roomCollection = collection(db, "rooms");
        const roomSnapshot = await getDocs(roomCollection);

        const roomsList = await Promise.all(
          roomSnapshot.docs.map(async (doc) => {
            const room = doc.data();
            const otherUserId =
              room.senderId === currentUserId
                ? room.receiverId
                : room.senderId;

            // Kullanıcı verisini getir
            const userDoc = await getDocs(collection(db, "user"));
            const otherUser = userDoc.docs
              .map((user) => ({ id: user.id, ...user.data() }))
              .find((user) => user.id === otherUserId) || {
              userName: "Bilinmiyor",
              userProfilePicture: "default-profile.png",
            };

            return {
              id: doc.id,
              ...room,
              roomName: otherUser.userName, // Oda adı diğer kullanıcının adı olarak ayarlanır
              roomImage: otherUser.userProfilePicture, // Diğer kullanıcının fotoğrafı
            };
          })
        );

        setData(roomsList);
        console.log(roomsList, "Rooms Data");
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, [db, currentUserId]); // currentUserId değiştiğinde yeniden çalıştır

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mesaj Odaları</h1>
      <div className={styles.roomList}>
        {data.map((room) => (
          <div
            key={room.id}
            className={styles.roomItem}
            onClick={() => router.push(`/rooms/${room.id}`)}
          >
            <img
              src={room.roomImage}
              alt={room.roomName}
              className={styles.roomImage}
            />
            <div>
              <h2 className={styles.roomName}>{room.roomName}</h2>
              <span className={styles.roomPreview}>Sohbete Başla</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
