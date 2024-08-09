"use client";
import React, { useState, useEffect } from "react";
import styles from "./forum.module.css";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostCreated from "@/component/createPost";
import { collection, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/app/layout";
import UserData from "./userData";
import DeletePost from "../deletePost";
import UpdatedPost from "../UpdatedPost";
import ForumTopSide from "../ForumTopSide";

export default function ForumDataFetch() {
  const [data, setData] = useState<any[]>([]);
  console.log(data,"data")
  const db = getFirestore(app);
  const [openPost, setOpenPost] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

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

  const handleUpdate = async (postId: string) => {
    try {
      const postRef = doc(db, "post", postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        setSelectedPost({ id: postId, ...postSnap.data() });
        setOpenUpdate(true);
      } else {
        console.log("Document not found");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  return (
    <div className={styles.main}>
      <ForumTopSide  profilePicture={""}/>
      <div className={styles.container}>
        <PostCreated opened={openPost} setOpenPost={setOpenPost} />
        <UpdatedPost
          selectedPost={selectedPost}
          data={fetchData}
          open={openUpdate}
          setOpenUpdate={setOpenUpdate}
          setPost={setData}
        />
        {data?.map((item: any) => (
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
              <FontAwesomeIcon 
                icon={faPenToSquare} 
                color="blue" 
                onClick={() => handleUpdate(item.id)} 
              />
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
