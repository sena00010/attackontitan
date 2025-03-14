import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { app } from "../../app/layout";
import { getFirestore } from "firebase/firestore";
import styles from "./MessagesPart.module.css";
import { getAuth } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faHeart, faStar, faImage } from "@fortawesome/free-solid-svg-icons";

const MessagesPart = ({ roomId }) => {
  const db = getFirestore(app);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const currentUserId = getAuth(app).currentUser?.uid;
  const [roomDetails, setRoomDetails] = useState(null);
  const [talker, setTalker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        const roomDoc = doc(db, "rooms", roomId);
        const roomSnapshot = await getDoc(roomDoc);

        if (roomSnapshot.exists()) {
          const roomData = roomSnapshot.data();
          setRoomDetails(roomData);
          const otherUserId = roomData.receiverId;

          if (otherUserId) {
            try {
              const userDoc = doc(db, "user", otherUserId);
              const userSnapshot = await getDoc(userDoc);

              if (userSnapshot.exists()) {
                setTalker(userSnapshot.data());
              }
            } catch (error) {
              console.error("Error fetching user details:", error);
            }
          }
        } else {
          console.error("Room not found.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room details:", error);
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, db]);

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
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [roomId, currentUserId, db]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageContent.trim()) return;

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        messageContent,
        senderId: currentUserId,
        receiverId: roomDetails?.receiverId || "unknown",
        timestamp: serverTimestamp(),
        isRead: false,
        readAt: new Date(),
        messageType: 'text',
      });

      setMessageContent("");
      // Focus the input after sending
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Emoji listeleri
  const emojis = ["✨", "🌟", "💖", "🎀"];

  return (
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          {!isLoading && talker ? (
              <>
                <img
                    src={talker?.userProfilePictures || "/default-avatar.png"}
                    alt="Profil"
                    className={styles.talkerImage}
                />
                <h2 className={styles.talkerName}>
                  {talker?.userName} ile Sohbet Odasındasınız
                </h2>
              </>
          ) : (
              <div className={styles.loading}>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
              </div>
          )}
        </div>

        <div className={styles.messagesContainer}>
          {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
              </div>
          ) : messages.length > 0 ? (
              <>
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
                <div ref={messagesEndRef} /> {/* Otomatik scroll için referans */}
              </>
          ) : (
              <div className={styles.emptyMessages}>
                <p>Henüz mesaj yok. Sohbete başlayalım!</p>
                <p>{emojis[Math.floor(Math.random() * emojis.length)]}</p>
              </div>
          )}
        </div>

        <form className={styles.inputContainer} onSubmit={sendMessage}>
          <input
              type="text"
              ref={inputRef}
              className={styles.inputField}
              placeholder="Mesajınızı yazın..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={handleKeyPress}
          />
          <button className={styles.sendButton} type="submit">
            Gönder
            <FontAwesomeIcon icon={faPaperPlane} style={{ marginLeft: '8px' }} />
          </button>
        </form>
      </div>
  );
};

export default MessagesPart;