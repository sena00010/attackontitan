"use client";
import React, { useEffect, useState } from "react";
import styles from "./FriendRequestList.module.css";
import { app } from "../../app/layout";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import { useRouter } from "next/navigation";
import OtherUserProfile from "../otherUserProfile";
import { getAuth } from "firebase/auth";
interface User{
  uid:string,
  userProfilePictures:string,
  userName:string,
  userLastName:string
}
const FriendRequestList = () => {
  const [data, setData] = useAtom(userAtom);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]); // Gönderilen isteklerin ID'lerini tutmak için state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Seçilen kullanıcı ID'sini tutmak için state

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setData(JSON.parse(savedUser));
    }
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  console.log(users, "users");
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = collection(db, "user");
      console.log(userCollection, "userCollection");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, [db]);

  const handleAddFriend = async (id: string) => {
    try {
      const fromUserId = data.uid; // Giriş yapan kullanıcının UID'si
      const toUserId = id; // Arkadaşlık isteği gönderilecek kullanıcının UID'si

      const friendRequestDoc = doc(collection(db, "friendRequest")); // Yeni bir document oluşturuyoruz
      await setDoc(friendRequestDoc, {
        from: fromUserId,
        to: toUserId,
        timeStamp: new Date(),
      });

      console.log(
        `${fromUserId} kişisinden ${toUserId} numaralı kişiye arkadaşlık isteği gönderildi.`
      );

      // İstek başarıyla gönderildiyse, state'i güncelle
      setSentRequests((prevState) => [...prevState, id]);
    } catch (error) {
      console.error("Arkadaşlık isteği gönderilirken hata oluştu:", error);
    }
  };
  const router = useRouter();
  
  const handleUserClick = (id: string) => {
    setSelectedUserId(id); 
    setProfileOpen(true);
   router.push(`/otherUserProfile/${id}`)
  }
  const auth = getAuth(app);

  const userId = auth.currentUser?.uid; 

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tüm kullanıcılar</h2>
      <ul className={styles.userList}>
  {users
    .filter((user) => user.uid !== userId)
    .map((user) => (
      <li
        key={user.uid}
        className={styles.userItem}
        onClick={() => handleUserClick(user.uid)} 
      >
        {user.userProfilePictures && (
          <img
            src={user.userProfilePictures}
            alt={`${user.userName}'s profile`}
            className={styles.profilePicture}
          />
        )}
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user.userName}</h3>
          <p className={styles.userNickname}>{user.userLastName}</p>
        </div>
        <button
          className={
            sentRequests.includes(user.uid)
              ? styles.requestSentButton
              : styles.addFriendButton
          }
          onClick={(e) => {
            e.stopPropagation(); // Butona tıklayınca profili açmayı durdurmak için
            handleAddFriend(user.uid);
          }}
          disabled={sentRequests.includes(user.uid)}
        >
          {sentRequests.includes(user.uid)
            ? "Arkadaşlık İsteği Gönderildi"
            : "Arkadaş Olarak Ekle"}
        </button>

        {profileOpen && selectedUserId === user.uid && (
          <OtherUserProfile id={user.uid} opened={profileOpen} />
        )}
      </li>
    ))}
</ul>

    </div>
  );
};

export default FriendRequestList;
