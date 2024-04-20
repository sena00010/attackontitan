import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './commentData.module.css'
import {collection, getDocs, getFirestore} from "@firebase/firestore";
import {app} from "@/app/layout";

interface Props {
    opened: boolean;
}

export default function ForumComment({ opened }: Props) {
    const db = getFirestore(app);
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        if(opened){
            fetchData();
        }
    }, [ opened]);
    const fetchData = async () => {
        try {
            const commentsCol = collection(db, 'post');
            const commentSnapshot = await getDocs(commentsCol);
            const commentList = commentSnapshot.docs.map(doc => doc.data());
            setData(commentList);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    if (!opened) {
        return null;
    }
    return (
        <div className={styles.main}>
            <div className={styles.commentArea}>
                <textarea  className={styles.textArea}>
                </textarea>
                <button className={styles.commentButton}>Yorum Yap!</button>
            </div>
            <div className={styles.container}>
                {data?.map((item: any) => {
                    return (
                        <div key={item.id} className={styles.commentContainer}>
                            {item.post.postComment.postCommentContent}
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
//