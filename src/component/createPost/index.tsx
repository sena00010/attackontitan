"use client";
import React, { useState } from "react";
import styles from "./createPost.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { CloseButton, Textarea, Box, Image } from "@mantine/core";
import { Formik } from "formik";
import { notifications } from "@mantine/notifications";
import "@mantine/dropzone/styles.css";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  addDoc,
  Timestamp,
  getFirestore,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/app/layout";

interface Character {
  opened: boolean;
  submitFunc: any;
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ExtendedFileWithPath extends File {
  url?: string;
}

export default function PostCreated({
  opened,
  setClosed,
  submitFunc,
}: Character) {
  const [uploadedImages, setUploadedImages] = useState<ExtendedFileWithPath[]>(
    []
  );
  const [uploadedFiles, setUploadedFiles] = useState<ExtendedFileWithPath[]>(
    []
  );

  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleFormSubmit = async (
    values: any,
    uploadedImages: ExtendedFileWithPath[]
  ) => {
    try {
      const imageUrls = await Promise.all(
        uploadedImages.map(async (file) => {
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      const postData = {
        postContent: {
          text: values.postContent,
          images: imageUrls,
        },
        timeStamp: Timestamp.now(),
      };

      await addDoc(collection(db, "post"), postData);

      notifications.update({
        id: "submitting-form",
        color: "teal",
        title: "Başarılı!",
        message: "Post başarıyla oluşturuldu.",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      notifications.update({
        id: "submitting-form",
        color: "red",
        title: "Hata!",
        message: "Post oluşturulurken bir hata meydana geldi.",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <form className={styles.form} action="">
          <input className={styles.textAreaInput} type="text" placeholder='Ne paylaşmak istersiniz?' />
          <input className={styles.textAreaInput} type="text" placeholder='Paylaşmak istediğiniz fotoğrafın linkini ekler misiniz?' />
          <button className={styles.submitButton} type="submit">Gönder</button>
        </form>
      </div>
    </div>
  );
};

export default PostCreated;
