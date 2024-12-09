import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { app } from "../../app/layout";
import { getFirestore } from "firebase/firestore";
import styles from "./MessagesPart.module.css";
import { getAuth } from "firebase/auth";

const MessagesPart = ({ roomId }) => {
  const db = getFirestore(app);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [talker, setTalker] = useState(null);
  const currentUserId = getAuth(app).currentUser?.uid;

  useEffect(() => {
    if (!roomId) return;

    // Mesajları dinlemek
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

      // Karşıdaki kişiyi belirlemek için ilk mesajdan `senderId` alıyoruz
      const otherUserId = messages.find(
        (message) => message.senderId !== currentUserId
      )?.senderId;

      if (otherUserId) {
        const userDoc = doc(db, "user", otherUserId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          setTalker(userSnapshot.data());
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, currentUserId]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        messageContent,
        senderId: currentUserId,
        timestamp: new Date(),
      });
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  console.log(talker,'talker');

  return (
    <div className={styles.chatWindow}>
      {/* Sohbet Odası Başlığı */}
      <div className={styles.chatHeader}>
        <img
          src={talker?.userProfilePictures}
          alt="Profil"
          className={styles.talkerImage}
        />
        <h2 className={styles.talkerName}>{talker?.userName} ile Sohbet Odasındasınız</h2>
      </div>
  
      {/* Mesajların Listelendiği Alan */}
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
  
      {/* Mesaj Gönderme Alanı */}
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
