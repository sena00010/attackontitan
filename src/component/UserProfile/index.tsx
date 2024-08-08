"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/layout";
import styles from './userProfile.module.css';

const UserProfile = () => {
  const [data, setData] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const updateUserData = async () => {
    const userDoc = doc(db, "user", data.id);
    await updateDoc(userDoc, { ...data });
    setShowSaveModal(true);
    setEditMode(false);
  };

  const deleteUserAccount = async () => {
    const userDoc = doc(db, "user", data.id);
    await deleteDoc(userDoc);
    // Hesabı sildikten sonra bir şeyler yap (örneğin yönlendirme)
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
          {editMode ? (
            <>
              <label>
                Name:
                <input className={styles.input} type="text" value={data.userName} onChange={(e) => setData({ ...data, userName: e.target.value })} />
              </label>
              <label>
                Last Name:
                <input className={styles.input} type="text" value={data.userLastName} onChange={(e) => setData({ ...data, userLastName: e.target.value })} />
              </label>
              <label>
                Nickname:
                <input className={styles.input} type="text" value={data.userNickname} onChange={(e) => setData({ ...data, userNickname: e.target.value })} />
              </label>
              <label>
                Email:
                <input className={styles.input} type="text" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
              </label>
              <label>
                Phone:
                <input className={styles.input} type="text" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
              </label>
              <label>
                Birthday:
                <input className={styles.input} type="text" value={data.birthday} onChange={(e) => setData({ ...data, birthday: e.target.value })} />
              </label>
              <label>
                Favorite Animes:
                <input className={styles.input} type="text" value={data.favoriteAnimes} onChange={(e) => setData({ ...data, favoriteAnimes: e.target.value })} />
              </label>
              <label>
                Favorite Mangas:
                <input className={styles.input} type="text" value={data.favoriteMangas} onChange={(e) => setData({ ...data, favoriteMangas: e.target.value })} />
              </label>
              <label>
                Hobbies:
                <input className={styles.input} type="text" value={data.userHobbies} onChange={(e) => setData({ ...data, userHobbies: e.target.value })} />
              </label>
              <label>
                Info:
                <input className={styles.input} type="text" value={data.userInfo} onChange={(e) => setData({ ...data, userInfo: e.target.value })} />
              </label>
              <button className={styles.button} onClick={updateUserData}>Save</button>
            </>
          ) : (
            <>
              <h1>{data.userName} {data.userLastName}</h1>
              <p>Nickname: {data.userNickname}</p>
              <p>Email: {data.email}</p>
              <p>Phone: {data.phone}</p>
              <p>Birthday: {data.birthday}</p>
              <p>Favorite Animes: {data.favoriteAnimes}</p>
              <p>Favorite Mangas: {data.favoriteMangas}</p>
              <p>Hobbies: {data.userHobbies}</p>
              <p>Info: {data.userInfo}</p>
            </>
          )}
          <button className={styles.button} onClick={() => setEditMode(!editMode)}>{editMode ? "Cancel" : "Edit"}</button>
          <button className={styles.button} onClick={() => setShowDeleteModal(true)}>Delete Account</button>
        </div>
      </div>

      {showSaveModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Your information has been updated successfully.</p>
            <button className={styles.button} onClick={() => setShowSaveModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete your account?</p>
            <button className={styles.button} onClick={deleteUserAccount}>Yes</button>
            <button className={styles.button} onClick={() => setShowDeleteModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
