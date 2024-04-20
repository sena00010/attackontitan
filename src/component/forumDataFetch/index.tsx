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
export default function ForumDataFetch() {
  const [data, setData] = useState<any>([]);
  const db = getFirestore(app);
  const [openComments, setOpenComments] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  useEffect(() => {
    fetchData();
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
  // const toggleComments = (postId: number) => {
  //     setOpenComments(prevState => openComments: !prevState);
  // }
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <PostCreated
          opened={openPost}
          setClosed={setOpenPost}
          submitFunc={() => {}}
        />
        {data.map((item: any) => (
          <div key={item.id} className={styles.postContainer}>
            <div className={styles.header}>
              <Image
                src={item.post.postImage[0]}
                style={{ borderRadius: "100%" }}
                width={50}
                height={50}
                alt={item.post.postImage[0]}
              />
              <div>userName</div>
            </div>
            <div> {item.post.postContent}</div>
            <div>
              <Image
                src={item.post.postImage[1]}
                width={300}
                height={300}
                alt={item.post.postImage[1]}
              />
            </div>
            <div className={styles.bottomReaction}>
              <div className={styles.rightReaction}>
                <div>
                  <FontAwesomeIcon color="red" icon={faHeart} />
                  {item.reactions}
                </div>
              </div>
              <div onClick={() => setOpenComments(!openComments)}>
                <FontAwesomeIcon
                  color={"purple"}
                  size={"xl"}
                  icon={faComment}
                />
              </div>
            </div>
            {<ForumComment opened={!openComments} />}
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => setOpenPost(!openPost)}>Gönderi Oluştur</button>
      </div>
    </div>
  );
}
