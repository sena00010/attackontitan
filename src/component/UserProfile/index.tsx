"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/layout";
import styles from './userProfile.module.css';

const UserProfile = () => {
  const [data, setData] = useState<any | null>(null);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setData({ id: userSnapshot.id, ...userSnapshot.data() });
      } else {
        console.error("User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setData(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.profileContainer}>
        <div className={styles.profilePicture}>
          {data.userProfilePictures === "" ? (
            <div className={styles.placeholderPicture}></div>
          ) : (
            <img src={data.userProfilePictures} alt="Profile" />
          )}
        </div>
        <div className={styles.profileDetails}>
          <h1>{data.userName} {data.userLastName}</h1>
          <p>Nickname: {data.userNickname}</p>
          <p>Email: {data.email}</p>
          <p>Phone: {data.phone}</p>
          <p>Birthday: {data.birthday}</p>
          <p>Favorite Animes: {data.favoriteAnimes}</p>
          <p>Favorite Mangas: {data.favoriteMangas}</p>
          <p>Hobbies: {data.userHobbies}</p>
          <p>Info: {data.userInfo}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
