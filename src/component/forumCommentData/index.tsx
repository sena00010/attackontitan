import { app } from "@/app/layout";
import {
  faCheck,
  faEdit,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styles from "./commentData.module.css";

interface Props {
  opened: boolean;
  comments: any[];
  postId: string;
  handleComment: (postId: string, commentText: string) => Promise<void>;
  users: any;
  formatDate: (timestamp: string) => string;
  refreshComments?: (postId: string) => Promise<void>; // Add this new prop
}

export default function ForumComment({
  opened,
  comments,
  postId,
  handleComment,
  users,
  formatDate,
  refreshComments, // Add the new prop here
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const db = getFirestore(app);
  const currentUser = getAuth(app).currentUser;

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await handleComment(postId, commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditText(comment.commentText);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const submitEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const commentRef = doc(db, "post", postId, "comments", commentId);
      await updateDoc(commentRef, {
        commentText: editText,
        edited: true,
        editedAt: new Date().toISOString(),
      });

      // Refresh comments from server after successful edit
      if (refreshComments) {
        await refreshComments(postId);
      } else {
        // Fallback to local update if no refresh function provided
        const updatedComments = comments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              commentText: editText,
              edited: true,
              editedAt: new Date().toISOString(),
            };
          }
          return c;
        });
      }

      setEditingCommentId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const confirmDelete = window.confirm(
        "Bu yorumu silmek istediğinizden emin misiniz?"
      );
      if (!confirmDelete) return;

      const commentRef = doc(db, "post", postId, "comments", commentId);
      await deleteDoc(commentRef);

      // Refresh comments from server after successful deletion
      if (refreshComments) {
        await refreshComments(postId);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!opened) {
    return null;
  }

  return (
    <div className={styles.main}>
      <div className={styles.commentArea}>
        <textarea
          className={styles.textArea}
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Share your thoughts about the anime..."
        ></textarea>
        <button
          className={styles.commentButton}
          onClick={submitComment}
          disabled={isSubmitting || !commentText.trim()}
        >
          {isSubmitting ? "Posting..." : "Post!"}
        </button>
      </div>

      <h3 className={styles.commentsHeader}>Fan Discussions</h3>

      <div className={styles.container}>
        {comments?.length === 0 ? (
          <div className={styles.noComments}>
            Be the first to start the discussion!
          </div>
        ) : (
          comments?.map((comment: any) => {
            const commentUser = users[comment.userId] || {};
            const isOwner = currentUser && comment.userId === currentUser.uid;

            return (
              <div key={comment.id} className={styles.commentContainer}>
                <div className={styles.commentHeader}>
                  <div className={styles.userAvatar}>
                    <img
                      src={
                        commentUser.userProfilePictures || "/defaultProfile.png"
                      }
                      alt={commentUser.userName || "Anonymous"}
                      className={styles.userImg}
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src =
                          "/defaultProfile.png";
                      }}
                    />
                  </div>
                  <div className={styles.commentInfo}>
                    <span className={styles.username}>
                      {commentUser.userName || "Anonymous Fan"}
                    </span>
                    <span className={styles.timestamp}>
                      {formatDate(comment.createdAt)}
                      {comment.edited && (
                        <span className={styles.editedMark}> (düzenlendi)</span>
                      )}
                    </span>
                  </div>

                  {isOwner && (
                    <div className={styles.commentActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => startEditing(comment)}
                        title="Düzenle"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => deleteComment(comment.id)}
                        title="Sil"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>

                {editingCommentId === comment.id ? (
                  <div className={styles.editContainer}>
                    <textarea
                      className={styles.editTextArea}
                      value={editText}
                      onChange={handleEditChange}
                    ></textarea>
                    <div className={styles.editActions}>
                      <button
                        className={styles.editSaveButton}
                        onClick={() => submitEdit(comment.id)}
                        disabled={!editText.trim()}
                      >
                        <FontAwesomeIcon icon={faCheck} /> Kaydet
                      </button>
                      <button
                        className={styles.editCancelButton}
                        onClick={cancelEditing}
                      >
                        <FontAwesomeIcon icon={faTimes} /> İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.commentContent}>
                    {comment.commentText || "No content"}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
