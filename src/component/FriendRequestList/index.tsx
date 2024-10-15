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

const FriendRequestList = () => {
  const [data, setData] = useAtom(userAtom);
  const [sentRequests, setSentRequests] = useState<string[]>([]); // Gönderilen isteklerin ID'lerini tutmak için state

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setData(JSON.parse(savedUser));
    }
  }, []);

  const [users, setUsers] = useState([]);
  console.log(users, "users");
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = collection(db, "user");
      console.log(userCollection,'userCollection')
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
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tüm kullanıcılar</h2>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            {user.userProfilePictures && (
              <img
                src={user.userProfilePictures}
                alt={`${user.name}'s profile`}
                className={styles.profilePicture}
              />
            )}
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{user.name}</h3>
              <p className={styles.userNickname}>{user.email}</p>
            </div>
            <button
              className={
                sentRequests.includes(user.id)
                  ? styles.requestSentButton
                  : styles.addFriendButton
              }
              onClick={() => handleAddFriend(user.id)}
              disabled={sentRequests.includes(user.id)}
            >
              {sentRequests.includes(user.id)
                ? "Arkadaşlık İsteği Gönderildi"
                : "Arkadaş Olarak Ekle"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequestList;
