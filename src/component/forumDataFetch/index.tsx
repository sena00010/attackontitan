"use client";
import React, { useState, useEffect } from "react";
import styles from "./forum.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faHeart,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
import { app } from "@/app/layout";
import ForumTopSide from "../ForumTopSide";
import PostCreated from "@/component/createPost";
import UpdatedPost from "../UpdatedPost";
import DeletePost from "../deletePost";

export default function ForumDataFetch() {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any>({});
  const db = getFirestore(app);
  const [openPost, setOpenPost] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Kullanıcı verilerini getir ve bir nesnede sakla
  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, "user");
      const usersSnapshot = await getDocs(usersCol);
      const usersData: any = {};
      usersSnapshot.docs.forEach((doc) => {
        usersData[doc.id] = doc.data(); // Kullanıcı ID'sine göre saklanıyor
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Post verilerini getir
  const fetchPosts = async () => {
    try {
      const postsCol = collection(db, "post");
      const postSnapshot = await getDocs(postsCol);
      const postList = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postList);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // İlk olarak kullanıcı verilerini çek
    fetchPosts(); // Sonrasında postları çek
  }, []);

  // openPost değiştiğinde tetiklenir
  useEffect(() => {
    if (!openPost) {
      fetchPosts(); // Yeni gönderi modalı kapandığında postları yeniden çek
    }
  }, [openPost]);

  const handleDelete = async (postId: string) => {
    await DeletePost(postId, fetchPosts);
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

  const formatDate = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffHours = Math.abs(now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      return `${Math.floor(diffHours)} saat önce`;
    }
    return postDate.toLocaleDateString("tr-TR");
  };

  return (
    <div className={styles.main}>
      <ForumTopSide profilePicture={""} />
      <PostCreated opened={openPost} setOpenPost={setOpenPost} />
      <UpdatedPost
        selectedPost={selectedPost}
        data={fetchPosts}
        open={openUpdate}
        setOpenUpdate={setOpenUpdate}
        setPost={setPosts}
      />
      {posts?.map((post) => {
        const user = users[post.userId] || {}; // Postu paylaşan kullanıcıyı eşleştir
        return (
          <div className={styles.post} key={post?.id}>
            <div className={styles.userData}>
              <img
                src={user?.userProfilePictures || "/defaultProfile.png"}
                alt="User"
              />
              <div className="userInfo">
                <span className={styles.username}>{user?.userName || "Anonim"}</span>
                <span className={styles.time}>{formatDate(post?.createdAt)}</span>
              </div>
            </div>
            <div className={styles.postContent}>
              <div>{post?.postContent?.text}</div>
              {post?.postContent?.image && (
                <img
                  width={300}
                  height={200}
                  src={post.postContent?.image}
                  alt="Post"
                />
              )}
            </div>
            <div className={styles.postActions}>
              <button className={`${styles.actionButton} like`}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className={`${styles.actionButton} comment`}>
                <FontAwesomeIcon icon={faComment} />
              </button>
              <button
                className={`${styles.actionButton} edit`}
                onClick={() => handleUpdate(post.id)}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button
                className={`${styles.actionButton} delete`}
                onClick={() => handleDelete(post.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        );
      })}
      <div>
        <button onClick={() => setOpenPost(true)} className={styles.createPostButton}>
          Oluştur
        </button>
      </div>
    </div>
  );
}
