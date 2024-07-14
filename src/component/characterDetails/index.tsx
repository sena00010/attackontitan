'use client'
import styles from "./details.module.css";
import Image from "next/image";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareXmark} from "@fortawesome/free-solid-svg-icons";
interface Character {
opened: boolean;
data:any;
// close:() =>void;
setClosed:React.Dispatch<React.SetStateAction<boolean>>
}
export default function CharacterDetails({opened,data,setClosed}:Character ){
    return (
        opened && (<div className={styles.container}>
             <div className={styles.closeButton}>
                 <FontAwesomeIcon icon={faSquareXmark} onClick={()=>setClosed(!opened) } size={"2x"}/>
             </div>
                {data.img ? (
                    <Image src={data.img} width={200} height={200} alt={data.name} style={{}}/>
                ) : undefined}
                <span>{data.name}</span>
                <span>{data.age}</span>
                <span>{data.occupation}</span>
                <span>{data.hometown}</span>
                <span>{data.affiliation}</span>
                <span>{data.relatives.map((relative:any) => <span>{relative.family}</span>)}</span>
                <span>{data.species}</span>
                <span>{data.residence}</span>

            </div>
        )
)
}
