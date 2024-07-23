"use client";
import React, { useState, useEffect } from "react";
import styles from "./forum.module.css";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostCreated from "@/component/createPost";
import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { app } from "@/app/layout";
import UserData from "./userData";
import DeletePost from "../deletePost"; // Fonksiyonu içe aktar
import UpdatedPost from "../UpdatedPost";

export default function ForumDataFetch() {
  const [data, setData] = useState<any[]>([]);
  const db = getFirestore(app);
  const [openPost, setOpenPost] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  console.log(openUpdate,"openUpdate")

  const fetchData = async () => {
    try {
      const postsCol = collection(db, "post");
      const postSnapshot = await getDocs(postsCol);
      const postList = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(postList ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (postId: string) => {
    await DeletePost(postId, fetchData);
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <PostCreated opened={openPost} setOpenPost={setOpenPost} />
        <UpdatedPost open = {openUpdate} setOpenUpdate={setOpenUpdate}/>
        {data.map((item: any) => (
          <div className={styles.post} key={item?.id}>
            <div className={styles.userData}>
              <UserData userId={item?.userId} />
            </div>
            <div className={styles.postContent}>
              <div>{item?.postContent?.text}</div>
              {item?.postContent?.image && (
                <img width={300} height={200} src={item.postContent?.image} alt="Post" />
              )}
            </div>
            <div>
              <FontAwesomeIcon 
                icon={faTrashCan} 
                color="red" 
                onClick={() => handleDelete(item.id)} 
              />
            </div>
            <div>
            <FontAwesomeIcon icon={faPenToSquare} color="blue" onClick={() => setOpenUpdate(true)} />
            </div>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => setOpenPost(true)} className={styles.postImage}>
          oluştur
        </button>
      </div>
    </div>
  );
}
