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
    opened && (
      <div className={styles.container}>
        <div className={styles.closeButton}>
          <FontAwesomeIcon
            icon={faSquareXmark}
            onClick={() => setClosed(!opened)}
            size={"2x"}
          />
        </div>
        <Formik
          initialValues={{
            postImages: [],
            postContent: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            notifications.show({
              id: "submitting-form",
              loading: true,
              message:
                "Dosyalarınızda güvenlik taraması yapılıyor. Verilerin boyutlarına göre işlem süresi uzun olabilir. Lütfen bekleyiniz...",
              autoClose: false,
              withCloseButton: false,
            });
            await handleFormSubmit(values, uploadedImages);
            setSubmitting(false);
            setUploadedImages([]);
            setClosed(false);
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div style={{ width: "90%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 10px #ccc",
                    borderRadius: "10px",
                    paddingLeft: "10px",
                    border: "1px solid var(--bg)",
                  }}
                >
                  <div className={styles.dropzoneContainer}>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        acceptedFiles.forEach((file) => {
                          if (file.type.includes("image")) {
                            setUploadedImages((prev) => [...prev, file]);
                          } else {
                            setUploadedFiles((prev) => [...prev, file]);
                          }
                        });
                      }}
                      maxSize={5 * 1024 ** 2}
                      accept={IMAGE_MIME_TYPE}
                      multiple
                    >
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            position: "relative",
                            fontSize: "3em",
                          }}
                          icon={faCamera}
                          size="xs"
                        />
                      </div>
                    </Dropzone>
                    {(uploadedImages?.length > 0 ||
                      uploadedFiles?.length > 0) &&
                      ((uploadedImages && uploadedImages?.length > 0) ||
                        (uploadedFiles && uploadedFiles?.length > 0)) && (
                        <Swiper
                          navigation
                          spaceBetween={10}
                          slidesPerView={2}
                          grabCursor={true}
                          pagination={{ clickable: true }}
                          className={styles.swiper}
                          coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                          }}
                        >
                          {(uploadedImages || []).map((file: any, index) => {
                            const imageUrl =
                              "url" in file
                                ? (file.url as string)
                                : file &&
                                  file.path &&
                                  URL.createObjectURL(file);

                            return (
                              <SwiperSlide
                                key={index}
                                className={styles.addPhotoInSwiper}
                              >
                                <Image
                                  src={imageUrl}
                                  alt={imageUrl}
                                  fit="cover"
                                  width={110}
                                  height={140}
                                  radius={16}
                                />
                                <Box className={styles.fileNameCont}></Box>
                                <CloseButton
                                  style={{
                                    top: 10,
                                    right: 10,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    let uploadingImageIndex =
                                      uploadedImages?.findIndex(
                                        (item) => item.name === file.name
                                      );
                                    setUploadedImages(
                                      uploadedImages?.filter(
                                        (_, i) => i !== uploadingImageIndex
                                      ) as ExtendedFileWithPath[]
                                    );
                                  }}
                                />
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      )}
                  </div>
                </div>
              </div>
              <Textarea
                className={styles.textAreaInput}
                name="postContent"
                id="postContent"
                placeholder="Yorum Yazınız"
                onChange={handleChange}
                value={values.postContent}
                label="Paylaşmak istediğiniz metni yazınız"
                required
              />
              <div className={styles.buttonContainer}>
                <button className={styles.submitButton} type="submit">
                  Paylaş
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    )
  );
}
