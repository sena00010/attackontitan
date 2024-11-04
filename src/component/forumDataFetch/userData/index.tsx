"use client"
import React, { useEffect, useState } from 'react'
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { app } from "@/app/layout";
import styles from "./userData.module.css";


const UserData = ({ userId }: { userId: string }) => {
  const [userData, setUserData] = useState<any>(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, "user", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }); 
  return (
    <div>
      {userData ? (
        <div className={styles.topInfo}>
         <div>{userData?.userNickname}</div> 
          <div><img  className={styles.topPhoto} src={userData?.userProfilePictures} width={100} height={100} /></div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default UserData;
