import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../layout'; 
import styles from './profile.module.css'; 

interface OtherUserProfileProps {
  id: string;
  opened: boolean;
}

const OtherUserProfile= ({ id, opened }:OtherUserProfileProps) => {
  const [userData, setUserData] = useState<any>(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, "user", id); 
          const userDoc = await getDoc(userDocRef);
            setUserData(userDoc.data()); 
            console.log(userData, 'data');
        } catch (error) {
          console.error("arror verdi:", error);
        }
      }
    };

    fetchUserData();
  }, [id, db]);

  if (!opened || !userData) {
    return null;
  }

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
        <button>istek gönder</button>
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
