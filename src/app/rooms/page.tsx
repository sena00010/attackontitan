'use client';

import React, { useEffect, useState } from "react";
import { app } from "../../app/layout";
import { collection, getDocs, getFirestore, query, or, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./page.module.css";
import MessagesPart from "@/component/MessagesPart";

const Rooms = () => {
  const [data, setData] = useState<any>([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null); // Seçili mesaj odası
  console.log(selectedRoom,'selectedRoom');
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Kullanıcının oturum durumunu kontrol et
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Mesaj odalarını getir
  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUserId) return;

      try {
        // Kullanıcıyla ilişkili mesaj odalarını sorgula
        const roomCollection = collection(db, "rooms");
        const q = query(
          roomCollection,
          or(
            where("receiverId", "==", currentUserId),
            where("senderId", "==", currentUserId)
          )
        );

        const roomSnapshot = await getDocs(q);

        // Sorgu sonucu boşsa, odaların bulunamadığını belirten bir durum ayarla
        if (roomSnapshot.empty) {
          setData([]); // Boş liste
          return;
        }

        const roomsList = roomSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(roomsList);
        console.log(data,'data')
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, [currentUserId]);
  console.log(data,'dataas')

  return (
    <div className={styles.container}>
      {/* Sol Sidebar */}
      <div className={styles.sidebar}>
        <h1 className={styles.title}>Mesaj Odaları</h1>
        <div className={styles.roomList}>
          {data.length > 0 ? (
            data.map((room) => (
              <div
                key={room.id}
                className={`${styles.roomItem} ${
                  selectedRoom?.id === room.id ? styles.selectedRoom : ""
                }`}
                onClick={() => setSelectedRoom(room)} // Odayı seçiyoruz
              >
                <img
                  src={room.roomImage || "default.jpg"}
                  alt={room.roomName}
                  className={styles.roomImage}
                />
                <div>
                  <h2 className={styles.roomName}>{room.roomName}</h2>
                  <span className={styles.roomPreview}>Sohbete Başla</span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noRooms}>Mesaj odası bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Sağdaki Mesaj Alanı */}
      <div className={styles.messageArea}>
        {selectedRoom ? (
          <MessagesPart roomId={selectedRoom.id} />
        ) : (
          <div className={styles.emptyMessageArea}>
            <p>Bir mesaj odası seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
