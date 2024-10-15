'use client';

import { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  getFirestore, 
  onSnapshot, 
  query, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { app } from '../../app/layout';
import styles from './MessagesPart.module.css';
import { getAuth } from 'firebase/auth';

const MessagesPart = ({ roomId }: { roomId: any }) => {
  const db = getFirestore(app);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [member, setMember] = useState<any>({});

  const getMemberMessage = async (senderId: string) => {
    try {
      const docRef = doc(db, 'user', senderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log(userData, 'userData');
        setMember(userData);
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const q = query(collection(db, 'rooms', roomId, 'messages'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);

      if (messagesData.length > 0) {
        const lastMessage = messagesData[messagesData.length - 1];
        await getMemberMessage(lastMessage.senderId);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        messageContent: messageContent,
        messageType: 'text',
        timestamp: new Date(),
        senderId: await getAuth(app).currentUser?.uid,
      });
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <div className={styles.messageHeader}>
              <img
                src={member?.userProfilePictures || 'default-profile.png'}
                alt="Sender"
              />
              <span>{member?.userName || 'Bilinmiyor'}</span>
            </div>
            <div className={styles.messageContent}>{message.messageContent}</div>
            <div className={styles.messageTimestamp}>
              {new Date(message.timestamp?.seconds * 1000).toLocaleString('tr-TR')}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        className={styles.inputField}
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Mesajınızı yazın..."
      />
      <button onClick={sendMessage} className={styles.sendButton}>
        Gönder
      </button>
    </div>
  );
};

export default MessagesPart;
