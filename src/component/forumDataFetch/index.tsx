"use client";
import { app } from "@/app/layout";
import PostCreated from "@/component/createPost";
import DeletePost from "@/component/deletePost";
import UpdatedPost from "@/component/UpdatedPost";
import { faComment, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ForumComment from "../forumCommentData";
import styles from "./forum.module.css";

export default function ForumDataFetch() {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any>({});
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const db = getFirestore(app);
  const [openPost, setOpenPost] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [likedPosts, setLikedPosts] = useState<boolean>(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showCommentForm, setShowCommentForm] = useState<{
    [key: string]: boolean;
  }>({});

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
          await fetchComments(doc.id);
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
      );
      setPosts(postList);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // İlk olarak kullanıcı verilerini çek
    fetchPosts(); // Sonrasında postları çek
  }, [likedPosts]);

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
      setCommentText("");
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
      const querySnapshot = await getDocs(likesCollection);
      const alreadyLiked = querySnapshot.docs.find(
        (doc) => doc.data().userId === userId
      );

      if (alreadyLiked) {
        await deleteDoc(doc(likesCollection, alreadyLiked.id));
      } else {
        const timeStamp = new Date().toISOString();
        await addDoc(likesCollection, {
          userId,
          timeStamp,
        });
      }

      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const data = postSnap.data();

        const likesCollection2 = collection(postRef, "likes");
        const querySnapshot2 = await getDocs(likesCollection2);
        const selfReaction = querySnapshot2.docs.some(
          (doc) => doc.data().userId === userId
        );
        const newLikeCount = selfReaction
          ? (data.likeCount || 0) + 1
          : (data.likeCount || 0) - 1;

        await updateDoc(postRef, {
          likeCount: newLikeCount,
          selfReaction: selfReaction,
        });
      }

      setLikedPosts(!likedPosts);
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
    <div className={styles.container}>
      <PostCreated opened={openPost} setOpenPost={setOpenPost} />
      <UpdatedPost
        selectedPost={selectedPost}
        data={fetchPosts}
        open={openUpdate}
        setOpenUpdate={setOpenUpdate}
        setPost={setPosts}
      />

      <div className={styles.createPostArea}>
        <div className={styles.createPostPrompt}>
          <img
            src={
              users[getAuth(app).currentUser?.uid]?.userProfilePictures ||
              "/defaultProfile.png"
            }
            alt="User"
            className={styles.userCreateAvatar}
          />
          <button
            onClick={() => setOpenPost(true)}
            className={styles.createPostField}
          >
            Neler paylaşmak istiyorsun?
          </button>
        </div>
        <button
          onClick={() => setOpenPost(true)}
          className={styles.createPostButton}
        >
          Gönderi Oluştur
        </button>
      </div>

      {posts.map((post) => {
        const user = users[post.userId] || {};
        return (
          <div className={styles.postCard} key={post?.id}>
            <div className={styles.postHeader}>
              <div className={styles.authorInfo}>
                <img
                  src={user?.userProfilePictures || "/defaultProfile.png"}
                  alt={user?.userName || "Anonim"}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>
                    {user?.userName || "Vinne"}
                  </div>
                  <div className={styles.postDate}>• Feb 14</div>
                </div>
              </div>

              <div className={styles.postTags}>
                <span className={styles.tag}>#Vinnearts</span>
                <span className={styles.tag}>#Artworks</span>
              </div>
            </div>

            <div className={styles.postImageWrapper}>
              {post?.postContent?.image && (
                <img
                  src={post.postContent?.image}
                  alt="Post"
                  className={styles.postImage}
                />
              )}
            </div>

            <div className={styles.postContent}>
              {post?.postContent?.text && (
                <div className={styles.postText}>
                  {post.postContent.text.length > 80 ? (
                    <>
                      <div>USAGI . ZERO TWO . ASUKA Cross mark</div>
                      <div>
                        CROSSOVER #2 COMING SOON, tell me 3 characters !
                      </div>
                    </>
                  ) : (
                    post.postContent.text
                  )}
                </div>
              )}
            </div>

            <div className={styles.postInteractions}>
              <button
                className={`${styles.interaction} ${post.selfReaction ? styles.active : ""}`}
                onClick={() => handleLike(post?.id)}
              >
                <FontAwesomeIcon icon={faHeart} />
                <span className={styles.interactionCount}>
                  {post.likeCount || "4203k"}
                </span>
              </button>

              <button
                className={styles.interaction}
                onClick={() => {
                  handleShowCommentForm(post.id);
                  handleShowComments(post.id);
                }}
              >
                <FontAwesomeIcon icon={faComment} />
                <span className={styles.interactionCount}>
                  {comments[post.id]?.length || "805"}
                </span>
              </button>

              <button className={styles.interaction}>
                <FontAwesomeIcon icon={faShare} />
                <span className={styles.interactionCount}>1k</span>
              </button>

              <button className={styles.shareButton}>
                <FontAwesomeIcon icon={faShare} />
              </button>
            </div>

            {showCommentForm[post.id] && (
              <div className={styles.commentSection}>
                <ForumComment
                  opened={showComments[post.id]}
                  comments={comments[post.id] || []}
                  postId={post.id}
                  handleComment={handleComment}
                  users={users}
                  formatDate={formatDate}
                  refreshComments={fetchComments} // Pass the fetchComments function as prop
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
