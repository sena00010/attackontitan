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
  addDoc,
} from "firebase/firestore";
import { app } from "@/app/layout";
import ForumTopSide from "../ForumTopSide";
import PostCreated from "@/component/createPost";
import UpdatedPost from "../UpdatedPost";
import DeletePost from "../deletePost";
import { getAuth } from "firebase/auth";

export default function ForumDataFetch() {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any>({});
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const db = getFirestore(app);
  const [openPost, setOpenPost] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showCommentForm, setShowCommentForm] = useState<{ [key: string]: boolean }>({});
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

  const fetchLikesCount = async (postId: string) => {
    try {
      const postRef = doc(db, "post", postId);
      const likesCollection = collection(postRef, "likes");
      const likesSnapshot = await getDocs(likesCollection);
      return likesSnapshot.size; // Like sayısını döner
    } catch (error) {
      console.error("Error fetching likes count:", error);
      return 0;
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const postRef = doc(db, "post", postId);
      const commentsCollection = collection(postRef, "comments");
      const commentsSnapshot = await getDocs(commentsCollection);
      const commentsData = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments((prev) => ({ ...prev, [postId]: commentsData }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Post verilerini getir
  const fetchPosts = async () => {
    try {
      const postsCol = collection(db, "post");
      const postSnapshot = await getDocs(postsCol);
      const postList = await Promise.all(
        postSnapshot.docs.map(async (doc) => {
          const likes = await fetchLikesCount(doc.id);
          await fetchComments(doc.id);
          return {
            id: doc.id,
            ...doc.data(),
            likes,
          };
        })
      );
      setPosts(postList);

      // Likes count güncellemesi
      const likesData: { [key: string]: number } = {};
      postList.forEach((post) => {
        likesData[post.id] = post.likes || 0;
      });
      setLikesCount(likesData);
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

  const handleComment = async (postId: string, commentText: string) => {
    try {
      const userId = getAuth(app).currentUser?.uid;
      if (!userId || !commentText) return;

      const postRef = doc(db, "post", postId);
      const commentsCollection = collection(postRef, "comments");

      await addDoc(commentsCollection, {
        userId,
        commentText,
        createdAt: new Date().toISOString(),
      });

      fetchComments(postId); // Yorumları tekrar çek
      console.log("Yorum başarıyla eklendi!");
    } catch (error) {
      console.error("Yorum eklenirken bir hata oluştu:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffHours =
      Math.abs(now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      return `${Math.floor(diffHours)} saat önce`;
    }
    return postDate.toLocaleDateString("tr-TR");
  };

  const handleLike = async (postId: string) => {
    try {
      const userId = getAuth(app).currentUser?.uid;
      if (!userId) return;

      const postRef = doc(db, "post", postId);
      const likesCollection = collection(postRef, "likes");

      // Kullanıcının zaten beğeni atıp atmadığını kontrol et
      const querySnapshot = await getDocs(likesCollection);
      const alreadyLiked = querySnapshot.docs.some(
        (doc) => doc.data().userId === userId
      );

      if (alreadyLiked) {
        console.log("Bu gönderiye zaten like atılmış!");
        return;
      }

      const timeStamp = new Date().toISOString();

      // Like ekle
      await addDoc(likesCollection, {
        userId,
        timeStamp,
      });

      // State'i güncelle
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: true, // Bu post artık beğenildi
      }));

      console.log("Like başarıyla eklendi!");
    } catch (error) {
      console.error("Like eklenirken bir hata oluştu:", error);
    }
  };
  const handleShowComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    if (!showComments[postId]) {
      fetchComments(postId);
    }
  };

  const handleShowCommentForm = (postId: string) => {
    setShowCommentForm((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
                      <span className={styles.username}>
                        {user?.userName || "Anonim"}
                      </span>
                      <span className={styles.time}>
                        {formatDate(post?.createdAt)}
                      </span>
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
                    <button
                      className={`${styles.actionButton} like`}
                      style={{
                        color: likedPosts[post.id] ? "red" : "black", // Beğenilmişse kırmızı
                      }}
                      onClick={() => handleLike(post?.id)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{likesCount[post.id] || 0} kişi</span>
                    </button>
        
                    <button
                      className={`${styles.actionButton} comment`}
                      onClick={() => handleShowCommentForm(post.id)}
                    >
                      <FontAwesomeIcon icon={faComment} />
                      Yorum Yap
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
                  {showCommentForm[post.id] && (
                    <div className={styles.commentForm}>
                      <textarea
                        placeholder="Yorumunuzu buraya yazın..."
                        className={styles.commentInput}
                        onChange={(e) => setCommentText(e.target.value)}
                        value={commentText}
                      >
                      
                      </textarea>
                      <button
                      className={`${styles.actionButton} show-comments`}
                      onClick={() => handleShowComments(post.id)}
                    >
                      {showComments[post.id] ? "Yorumları Gizle" : "Yorumları Göster"}
                      {showComments[post.id] && (
                    <div className={styles.comments}>
                      {comments[post.id]?.map((comment) => {
                        const commentUser = users[comment.userId] || {};
                        return (
                          <div key={comment.id} className={styles.comment}>
                            <img
                              src={
                                commentUser.userProfilePictures ||
                                "/defaultProfile.png"
                              }
                              alt="User"
                              className={styles.commentUserImg}
                            />
                            <span className={styles.commentUsername}>
                              {commentUser.userName || "Anonim"}
                            </span>
                            <span className={styles.commentText}>
                              {comment.commentText}
                            </span>
                            <span className={styles.commentTime}>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                    </button>
                      <button
                        className={styles.commentButton}
                        onClick={() => handleComment(post.id, commentText)}
                        disabled={!commentText.trim()}
                      >
                        Gönder
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <div>
              <button
                onClick={() => setOpenPost(true)}
                className={styles.createPostButton}
              >
                Oluştur
              </button>
            </div>
          </div>
        );
        

  
}
