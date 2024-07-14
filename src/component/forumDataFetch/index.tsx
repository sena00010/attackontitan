"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./forum.module.css";
import {
  faComment,
  faHashtag,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {
    fetchData();
    console.log(data, "data");
  }, []);

  const fetchData = async () => {
    try {
      const postsCol = collection(db, "post");
      const postSnapshot = await getDocs(postsCol);
      const postList = postSnapshot.docs.map((doc) => doc.data());
      console.log(postList, "postList");
      setData(postList ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <PostCreated
          opened={openPost}
          setClosed={setOpenPost}
          submitFunc={() => {}}
        />
        {data.map((item: any) => (
          <div className={styles.post} key={item.userId}>
            <div className={styles.userData}>
              <UserData userId={item.userId} />
            </div>
            <div className={styles.postContent}>
              <div>{item.postContent.text}</div>
              <div>
                {" "}
                <img
                  src={item.postContent.image}
                  alt={item.postContent.image}
                  className={styles.postImage}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
