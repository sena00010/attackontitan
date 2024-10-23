import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
import styles from './profile.module.css'; 
import { app } from '@/app/layout';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtoms';
import { getAuth } from 'firebase/auth';
import { query, where, getDocs } from 'firebase/firestore';

interface OtherUserProfileProps {
  id: string;
  opened: boolean;
}

const OtherUserProfile= ({ id, opened }:OtherUserProfileProps) => {
  const [userData, setUserData] = useState<any>(null);
  const db = getFirestore(app);
  const [data, setData] = useAtom(userAtom);
  const [invitationStatus,setInvitationStatus]=useState(false);


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
        setInvitationStatus(true);  // İstek varsa durumu true yap
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
            console.log(userData, 'data');
            console.log(userData,'userData')
            console.log(userDoc,'userDoc')
        } catch (error) {
          console.error("arror verdi:", error);
        }
      }
    };

    fetchUserData();
  }, [id, db]);
  const auth = getAuth(app);
  const handleAddFriend = async (id: string) => {
    const friendId = id;
    const userId = auth.currentUser?.uid;  // Giriş yapan kullanıcının id'sini al
    const invitationCollection = collection(db, 'friendInvatition');
    const notificationCollection = collection(db, 'notification');
    console.log('friendId', friendId, 'userId', userId);
 
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
      await addDoc(notificationCollection, {
        'friend_id': friendId,
        'user_id': userId,
      });
      setInvitationStatus(true);

      console.log(invitationStatus, 'invitationStatus');
    } catch (error) {
      console.error("Arkadaşlık isteği gönderilirken hata oluştu:", error);
    }
 };
 
 if (!opened || !userData) {
   return null;
 }
 
console.log('userData',userData);
  return (
    <div className={styles.profileContainer}>
      <h3 className={styles.title}>Kullanıcı Profili</h3>
      {userData.userProfilePictures && (
        <img
          src={userData.userProfilePictures}
          alt={`${userData.name}'s profile`}
          className={styles.profilePicture}
        />
      )}
      <div className={styles.userInfo}>
        <button
         onClick=
         {(e)=>{!invitationStatus?handleAddFriend(userData.uid)
         :e.preventDefault();
         }}>{invitationStatus?'istek gönderildi':'İstek Gönder'}</button>
        <button>Mesaj gönder</button>

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
