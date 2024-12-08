"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc,getDocs , updateDoc, deleteDoc, getFirestore, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/layout";
import styles from './userProfile.module.css';
import ForumTopSide from "../ForumTopSide";
import { log } from "console";

const UserProfile = () => {
  const [data, setData] = useState<any | null>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
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
  const fetchUserFriendsData = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId);
      const friendsCollection = collection(userDoc, "friends");
      const friendsSnapshot = await getDocs(friendsCollection);
  
      console.log("Friends Snapshot:", friendsSnapshot);
  
      if (!friendsSnapshot.empty) {
        const friendsData = await Promise.all(
          friendsSnapshot.docs.map(async (friendDoc) => {
            console.log("Friend Doc Data:", friendDoc.data());
            const friendId = friendDoc.data().friend_id;
            if (!friendId) {
              console.error("Missing friend_id in friends document.");
              return null;
            }
  
            const friendRef = doc(db, "user", friendId);
            const friendSnapshot = await getDoc(friendRef);
  
            if (friendSnapshot.exists()) {
              console.log("Friend Snapshot:", friendSnapshot.data());
              return { id: friendSnapshot.id, ...friendSnapshot.data() };
            } else {
              console.error(`Friend with ID ${friendId} not found in user collection.`);
              return null;
            }
          })
        );
  
        setFriends(friendsData.filter((friend) => friend !== null)); // Geçerli arkadaşları ekle
      } else {
        console.error("No friends found in friends collection.");
      }
    } catch (error) {
      console.error("Error fetching user friends:", error);
    }
  };
  
  
  const fetchUserNotificationsData = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId);
      const notificationsCollection = collection(userDoc, "notification");
      console.log("Fetching notifications collection...");
      const notificationsSnapshot = await getDocs(notificationsCollection);
  
      if (!notificationsSnapshot.empty) {
        const notificationsData = await Promise.all(
          notificationsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            console.log("Notification Data:", data);
  
            const friendRef = doc(db, "user", data.friend_id); // friend_id kullanarak kullanıcıyı bul
            const friendSnapshot = await getDoc(friendRef);
  
            if (friendSnapshot.exists()) {
              console.log("Friend Details Found:", friendSnapshot.data());
            } else {
              console.error(`Friend with ID ${data.friend_id} not found.`);
            }
  
            const friendDetails = friendSnapshot.exists()
              ? { id: friendSnapshot.id, ...friendSnapshot.data() }
              : null;
  
            return {
              id: doc.id,
              ...data,
              friendDetails, // İlgili kullanıcı bilgilerini ekle
              isSender: data.user_id === userId, // Gönderen ben miyim?
            };
          })
        );
        setNotifications(notificationsData);
      } else {
        console.error("No notifications found.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  

console.log(notifications,"vnotificationsnotificationsnotificationsnotifications");
  const updateUserData = async () => {
    const userDoc = doc(db, "user", data.id);
    await updateDoc(userDoc, { ...data });
    setShowSaveModal(true);
    setEditMode(false);
  };

  const deleteUserAccount = async () => {
    const userDoc = doc(db, "user", data.id);
    await deleteDoc(userDoc);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid); // Kullanıcı bilgilerini getir
        fetchUserFriendsData(user.uid); // Arkadaş listesini getir
        fetchUserNotificationsData(user.uid);
            } else {
        setData(null);
        setFriends([]); // Arkadaş listesini temizle
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.main}>
        <div className={styles.sideDiv}>
        <h3>Friends List</h3>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} className={styles.friendItem}>
                <div className={styles.friendProfilePicture}>
                  {friend.userProfilePictures ? (
                    <img  src={friend.userProfilePictures} alt={friend.userName} />
                  ) : (
                    <div className={styles.placeholderPicture}></div>
                  )}
                </div>
                <p>{friend.userName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends found.</p>
        )}
        <p>Total Friends: {friends.length}</p>
      </div>
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
      <div className={styles.sideDiv}>
  <h3>Notifications</h3>
  {notifications.length > 0 ? (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>
          {notification.isSender ? (
            <>
              {/* İstek gönderilen kullanıcıyı bul */}
              <p>
                You sent a request to{" "}
                <strong>
                  {notification.friendDetails?.userName}{" "}
                  {notification.friendDetails?.userLastName}
                </strong>{" "}
                on {new Date(notification.created_at).toLocaleDateString()}.
              </p>
            </>
          ) : (
            <>
              {/* İstek gönderen kullanıcıyı bul */}
              <p>
                <strong>
                  {notification.friendDetails?.userName}{" "}
                  {notification.friendDetails?.userLastName}
                </strong>{" "}
                sent you a request on{" "}
                {new Date(notification.created_at).toLocaleDateString()}.
              </p>
            </>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>No notifications found.</p>
  )}
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
