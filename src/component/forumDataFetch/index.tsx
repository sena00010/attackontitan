'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './forum.module.css'
import {faComment, faHashtag, faHeart} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import ForumComment from "@/component/forumCommentData";

export default function ForumDataFetch() {
    const [data, setData] = useState([]);
    const[openComment,setOpenComment]=useState(false)
    console.log(openComment,'openComment')
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const apiUrl = `https://dummyjson.com/posts`;
            const response = await axios.get(apiUrl);
            setData(response.data.posts);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                {data.map((item: any) => (
                    <div key={item.id} className={styles.postContainer}>
                        <div className={styles.header}>
                            <Image src={item.img} style={{ borderRadius: "100%" }} width={50} height={50} alt={item.name} />
                            <div>userName</div>
                        </div>
                        <div>{item.body}</div>
                        <div className={styles.bottomReaction}>
                            <div className={styles.rightReaction}>
                                <div><FontAwesomeIcon color="red" icon={faHeart}/>{item.reactions}</div>
                                <div>
                                    {item.tags.map((tag: any, index: number) => (
                                        <span key={index}>
                                <FontAwesomeIcon icon={faHashtag}/> {tag}
                            </span>
                                    ))}
                                </div>
                            </div>
                            <div onClick={() => setOpenComment(!openComment)}><FontAwesomeIcon  size={'xl'} icon={faComment}/></div>
                        </div>
                    </div>
                ))}
                <ForumComment opened={openComment}/>
            </div>
        </div>
    );

}
