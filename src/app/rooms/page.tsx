'use client';

import React, { useEffect, useState } from "react";
import { app } from "../../app/layout";
import { collection, getDocs, getFirestore, query, or, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./page.module.css";
import MessagesPart from "@/component/MessagesPart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faEnvelopeOpen, faSearch, faUser, faStar } from "@fortawesome/free-solid-svg-icons";

const Rooms = () => {
  const [data, setData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

      setIsLoading(true);
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
          setData([]);
          setIsLoading(false);
          return;
        }

        const roomsList = roomSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(roomsList);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [currentUserId, db]);

  return (
      <div className={styles.container}>
        {/* Sol Sidebar */}
        <div className={styles.sidebar}>
          <h1 className={styles.title}>Mesaj Odaları</h1>

          <div className={styles.roomList}>
            {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Odalar yükleniyor...</p>
                </div>
            ) : data.length > 0 ? (
                data.map((room) => (
                    <div
                        key={room.id}
                        className={`${styles.roomItem} ${
                            selectedRoom?.id === room.id ? styles.selectedRoom : ""
                        }`}
                        onClick={() => setSelectedRoom(room)}
                    >
                      <img
                          src={room.roomImage || "/default-avatar.png"}
                          alt={room.roomName}
                          className={styles.roomImage}
                      />
                      <div>
                        <h2 className={styles.roomName}>
                          {room.roomName}
                        </h2>
                        <span className={styles.roomPreview}>
                    <FontAwesomeIcon icon={faCommentDots} style={{ marginRight: '5px' }} />
                    Sohbete Başla
                  </span>
                      </div>
                    </div>
                ))
            ) : (
                <div className={styles.noRooms}>
                  <FontAwesomeIcon icon={faEnvelopeOpen} style={{ fontSize: '28px', color: '#F39C12', marginBottom: '10px' }} />
                  <p>Henüz mesaj odası bulunmuyor.</p>
                  <p style={{ fontSize: '14px', opacity: 0.8 }}>Yeni bir sohbet başlatmak için bir kullanıcı profiline gidin.</p>
                </div>
            )}
          </div>
        </div>

        {/* Sağdaki Mesaj Alanı */}
        <div className={styles.messageArea}>
          {selectedRoom ? (
              <MessagesPart roomId={selectedRoom.id} />
          ) : (
              <div className={styles.emptyMessageArea}>
                <p>Sohbet etmek için bir mesaj odası seçin</p>
                <p className={styles.emptyMessageSubtext}>
                  Anime dünyasında yeni arkadaşlıklar kurun! 💫
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default Rooms;