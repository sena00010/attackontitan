"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./forum.module.css";
import { faComment, faHashtag, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import ForumComment from "@/component/forumCommentData";
import PostCreated from "@/component/createPost";
import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { app } from "@/app/layout";
import UserData from "./userData";

export default function ForumDataFetch() {
  const [data, setData] = useState<any>([]);
  const db = getFirestore(app);
  const [openComments, setOpenComments] = useState(false);
  const [openPost, setOpenPost] = useState(false);

  const fetchData = async () => {
    try {
      const postsCol = collection(db, "post");
      const postSnapshot = await getDocs(postsCol);
      const postList = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(postList ?? []);
      console.log(postList, "postList");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <PostCreated
          opened={openPost}
          setClosed={setOpenPost}
          submitFunc={() => {}}
        />
        {data.map((item: any) => (
          <div className={styles.post} key={item.id}>
            <div className={styles.userData}>
              <UserData userId={item.userId} />
            </div>
            <div className={styles.postContent}>
              <div>{item.postContent?.text}</div>
              {item.postContent?.image && (
                <div>
                  <img
                    src={item.postContent.image}
                    alt={item.postContent.image}
                    className={styles.postImage}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={() => setOpenPost(!openPost)}
          className={styles.postImage}
        >
          oluştur
        </button>
      </div>
    </div>
  );
}
