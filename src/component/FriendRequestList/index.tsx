'use client'
import React, { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import styles from "./FriendRequestList.module.css";
import { app } from "../../app/layout";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtoms";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import OtherUserProfile from "../otherUserProfile";
interface User {
  uid: string;
  userProfilePictures: string;
  userName: string;
  userLastName: string;
}

const FriendRequestList = () => {
  const [data, setData] = useAtom(userAtom);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = collection(db, "user");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(userList);
    };

    fetchUsers();
  }, [db]);

  useEffect(() => {
    const checkInvitationStatus = async (friendId: string) => {
      const invitationQuery = query(
        collection(db, "friendInvatition"),
        where("friend_id", "==", friendId),
        where("user_id", "==", userId)
      );

      const querySnapshot = await getDocs(invitationQuery);
      if (!querySnapshot.empty) {
        setSentRequests((prev) => [...prev, friendId]);
      }
    };

    users.forEach((user) => {
      if (user.uid !== userId) {
        checkInvitationStatus(user.uid);
      }
    });
  }, [users, userId]);

  const handleAddFriend = async (id: string) => {
    const friendId = id;

    if (!userId || sentRequests.includes(friendId)) return;

    try {
      await addDoc(collection(db, "friendInvatition"), {
        friend_id: friendId,
        user_id: userId,
        created_at: new Date(),
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
  
      setSentRequests((prev) => [...prev, friendId]);
    } catch (error) {
      console.error("Arkadaşlık isteği gönderilirken hata oluştu:", error);
    }
  };

  const handleUserClick = (id: string) => {
    setSelectedUserId(id);
    setProfileOpen(true);
    router.push(`/otherUserProfile/${id}`); 
  };

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
                  e.stopPropagation(); // Butona tıklanınca profil açılmasını engelliyoruz
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
