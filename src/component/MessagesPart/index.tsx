import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { app } from "../../app/layout";
import { getFirestore } from "firebase/firestore";
import styles from "./MessagesPart.module.css";
import { getAuth } from "firebase/auth";

const MessagesPart = ({ roomId }: any) => {
  const db = getFirestore(app);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const currentUserId = getAuth(app).currentUser?.uid;
  const [roomDetails, setRoomDetails] = useState<any>(null); 
  const [talker,setTalker]=useState<any>(null);

  useEffect(() => {
    if (!roomId) return;
  
    const fetchRoomDetails = async () => {
      try {
        const roomDoc = doc(db, "rooms", roomId);
        const roomSnapshot = await getDoc(roomDoc);
  
        if (roomSnapshot.exists()) {
          const roomData = roomSnapshot.data();
          setRoomDetails(roomData);
          const otherUserId = roomData.receiverId; // Direkt roomData'dan al
  
          if (otherUserId) {
            try {
              const userDoc = doc(db, "user", otherUserId);
              const userSnapshot = await getDoc(userDoc);
  
              if (userSnapshot.exists()) {
                setTalker(userSnapshot.data()); // Konuşmacıyı güncelle
              }
            } catch (error) {
              console.error("Error fetching user details:", error);
            }
          }
        } else {
          console.error("Room not found.");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
  
    fetchRoomDetails();
  }, [roomId]);
  

  useEffect(() => {
    if (!roomId) return;

    const messagesQuery = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messages);
   
    });

    return () => unsubscribe();
  }, [roomId, currentUserId]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        messageContent,
        senderId: currentUserId,
        receiverId: roomDetails?.receiverId || "unknown",
        timestamp: new Date(),
        isRead:false,
        readAt:new Date(),
        messageType:'text',

      });
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img
          src={talker?.userProfilePictures}
          alt="Profil"
          className={styles.talkerImage}
        />
        <h2 className={styles.talkerName}>
          {talker?.userName} ile Sohbet Odasındasınız
        </h2>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((message) => {
          const isSender = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`${styles.message} ${
                isSender ? styles.messageSender : styles.messageReceiver
              }`}
            >
              <div className={styles.messageContent}>
                {message.messageContent}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Mesaj yaz..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          Gönder
        </button>
      </div>
    </div>
  );
};

export default MessagesPart;
