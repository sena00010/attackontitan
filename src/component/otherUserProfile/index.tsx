'use client'
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './profile.module.css'; 
import { app } from '@/app/layout';
import { getAuth } from 'firebase/auth';
import { useRouter } from "next/navigation";

interface OtherUserProfileProps {
  id: string;
  opened: boolean;
}

const OtherUserProfile = ({ id, opened }: OtherUserProfileProps) => {
  const [userData, setUserData] = useState<any>(null);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const router = useRouter(); // useRouter burada tanımlandı
  const [invitationStatus, setInvitationStatus] = useState(false);

  useEffect(() => {
    const checkInvitationStatus = async () => {
      const friendId = userData.userId;
      const userId = auth.currentUser?.uid; 

      if (!userId || !friendId) {
        console.error("Kullanıcı ID'leri bulunamadı");
        return;
      }

      const invitationQuery = query(
        collection(db, 'friendInvatition'),
        where('friend_id', '==', friendId),
        where('user_id', '==', userId)
      );

      try {
        const querySnapshot = await getDocs(invitationQuery);
        if (!querySnapshot.empty) {
          setInvitationStatus(true); 
        }
      } catch (error) {
        console.error("Davetiye durumu kontrol edilirken hata oluştu:", error);
      }
    };

    if (userData) {
      checkInvitationStatus();
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, "user", id); 
          const userDoc = await getDoc(userDocRef);
          setUserData(userDoc.data()); 
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [id, db]);

  const handleAddFriend = async (id: string) => {
    const friendId = id;
    const userId = auth.currentUser?.uid;
    const invitationCollection = collection(db, 'friendInvatition');
    const notificationCollection = collection(db, 'notification');

    if (!userId) {
      console.error("Giriş yapan kullanıcının ID'si bulunamadı");
      return;
    }

    try {
      await addDoc(invitationCollection, {
        'friend_id': friendId,
        'user_id': userId,
        'created_at': new Date(),
        'updated_at': new Date()
      });
      await addDoc(collection(db, "user", userId, "notification"), {
        friend_id: friendId,
        user_id: userId,
        created_at: new Date(),
      });
  
      // Gönderenin friends koleksiyonuna arkadaş kaydını ekle
      await addDoc(collection(db, "user", friendId, "notification"), {
        friend_id: userId,
        user_id: friendId,
        created_at: new Date(),
      });
  
      setInvitationStatus(true);
    } catch (error) {
      console.error("Arkadaşlık isteği gönderilirken hata oluştu:", error);
    }
  };

  const handleSendMessage = async (friendId: string) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !userData) {
      console.error("Giriş yapan kullanıcı bulunamadı veya kullanıcı verisi eksik.");
      return;
    }
  
    try {
      const roomsRef = collection(db, "rooms");
  
      // 1. İlk sorgu: senderId = currentUserId ve receiverId = friendId olan oda var mı?
      const firstQuery = query(
        roomsRef,
        where("senderId", "==", currentUserId),
        where("receiverId", "==", friendId)
      );
      const firstSnapshot = await getDocs(firstQuery);
  
      let roomId;
      if (!firstSnapshot.empty) {
        roomId = firstSnapshot.docs[0].id;
      } else {
        // 2. İkinci sorgu: senderId = friendId ve receiverId = currentUserId olan oda var mı?
        const secondQuery = query(
          roomsRef,
          where("senderId", "==", friendId),
          where("receiverId", "==", currentUserId)
        );
        const secondSnapshot = await getDocs(secondQuery);
  
        if (!secondSnapshot.empty) {
          roomId = secondSnapshot.docs[0].id;
        }
      }
  
      // 3. Eğer oda yoksa yeni bir oda oluştur ve profil resmi ile oda ismini ekle
      if (!roomId) {
        const roomData = {
          senderId: currentUserId,
          receiverId: friendId,
          createdAt: new Date(),
          roomImage: userData.userProfilePictures || "default-room-image.png", 
          roomName: `${userData.userNickname} ile Sohbet`, 
        };
  
        const newRoomRef = await addDoc(collection(db, "rooms"), roomData);
        roomId = newRoomRef.id;
      }
  
      // 4. Odaya yönlendir
      router.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error("Mesaj odası kontrol edilirken veya oluşturulurken hata oluştu:", error);
    }
  };
  

  if (!opened || !userData) {
    return null;
  }

  return (
    <div className={styles.profileContainer}>
      <h3 className={styles.title}>{`${userData.userNickname}'s profile`}</h3>
      {userData.userProfilePictures && (
        <img
          src={userData.userProfilePictures}
          alt={`${userData.name}'s profile`}
          className={styles.profilePicture}
        />
      )}
      <div className={styles.userInfo}>
        <button
          className={`${styles.button} ${styles.requestButton}`}
          onClick={(e) => {
            !invitationStatus ? handleAddFriend(userData.uid) : e.preventDefault();
          }}
          disabled={invitationStatus}
        >
          {invitationStatus ? "İstek Gönderildi" : "İstek Gönder"}
        </button>

        <button 
          className={`${styles.button} ${styles.messageButton}`} 
          onClick={() => handleSendMessage(userData.uid)}
        >
          Mesaj Gönder
        </button>

        <p><strong>İsim:</strong> {userData.userName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Telefon:</strong> {userData.phone}</p>
        <p><strong>Doğum Tarihi:</strong> {userData.birthday}</p>
        <p><strong>Favori Anime:</strong> {userData.favoriteAnimes}</p>
        <p><strong>Favori Manga:</strong> {userData.favoriteMangas}</p>
        <p><strong>Hobiler:</strong> {userData.userHobbies}</p>
        <p><strong>Nickname:</strong> {userData.userNickname}</p>
        <p><strong>Hakkında:</strong> {userData.userInfo}</p>
      </div>
    </div>
  );
};

export default OtherUserProfile;
