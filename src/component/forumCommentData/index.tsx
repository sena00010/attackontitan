import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './commentData.module.css'

interface Props {
    opened: boolean;
}

export default function ForumComment({ opened }: Props) {
    const [data, setData] = useState([]);
 console.log(data,'commentData')
    useEffect(() => {
        if(opened){
            fetchData();
        }
    }, [data, opened]);
    const fetchData = async () => {
        try {
            const apiUrl = `https://dummyjson.com/posts/1/comments`;
            const response = await axios.get(apiUrl);
            setData(response.data.comments);
            console.log(data,'commmmennnttData')
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    if (!opened) {
        return null;
    }
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                {data?.map((item: any) => {
                    console.log(item, 'item');
                    return (
                        <div key={item.id} className={styles.postContainer}>
                            {item.body}
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
