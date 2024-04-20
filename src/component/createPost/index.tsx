import styles from "./createPost.module.css";
import {CloseButton, Modal, Textarea} from "@mantine/core";
import { Formik } from "formik";
import { notifications } from "@mantine/notifications";
import "@mantine/dropzone/styles.css";
import React, { useState } from "react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faCamera,
    faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface Character {
    opened: boolean;
    submitFunc: any;
    setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostCreated({
                                        opened,
                                        setClosed,
                                        submitFunc,
                                    }: Character) {
    const [uploadedImages, setUploadedImages] = useState<[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<[]>([]);

    return opened && (
        <div className={styles.container}>
            <div className={styles.closeButton}>
                <FontAwesomeIcon icon={faSquareXmark} onClick={() => setClosed(!opened)} size={"2x"} />
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
                            "Dosyalarınızda güvenlik taraması yapılıyor. Verilerin boyutlarına göre işlem süresi uzun olabilir. Lütfen bekleyiniz... ",
                        autoClose: false,
                        withCloseButton: false,
                    });
                    await submitFunc(values, uploadedImages, uploadedFiles);
                    setSubmitting(false);
                    setUploadedImages([]);
                }}
            >
                {({ handleSubmit, touched, handleChange, values, errors }) => (
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
                                        onDrop={(files) => console.log("accepted files", files)}
                                        onReject={(files) => console.log("rejected files", files)}
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
                                            <FontAwesomeIcon
                                                style={{
                                                    position: "absolute",
                                                    bottom: "0",
                                                    right: "0",
                                                    fontSize: "2em",
                                                    padding: "5px",
                                                }}
                                                icon={faAdd}
                                                size="2x"
                                            />
                                        </div>
                                    </Dropzone>
                                    {(uploadedImages?.length > 0 || uploadedFiles?.length > 0) &&
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
                                                {(uploadedFiles || []).map(
                                                    (file: RecordData | any, index) => {
                                                        const fileUrl =
                                                            'url' in file
                                                                ? (file.url as string)
                                                                : file &&
                                                                file.path &&
                                                                URL.createObjectURL(file);
                                                        const extension = (file.path || file.filename)
                                                            ?.split('.')
                                                            .pop()
                                                            .toLowerCase();
                                                        return (
                                                            <SwiperSlide
                                                                key={index}
                                                                className={styles.addPhotoInSwiper}
                                                            >
                                                                {extension === 'pdf' ? (
                                                                    <PdfView
                                                                        src={fileUrl || ''}
                                                                        mini={true}
                                                                        name={file?.filename || file?.name || ''}
                                                                    />
                                                                ) : (
                                                                    <Box
                                                                        style={{
                                                                            height: '100%',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        <NextImage
                                                                            src={
                                                                                (allFileExtensions[extension] ===
                                                                                    'word' &&
                                                                                    '/icons/msword.png') ||
                                                                                (allFileExtensions[extension] ===
                                                                                    'excel' &&
                                                                                    '/icons/msexcel.png') ||
                                                                                '/icons/anyfile.png'
                                                                            }
                                                                            alt={extension}
                                                                            width={140}
                                                                            height={120}
                                                                            //radius={16}
                                                                            // caption={file.path || file.filename}
                                                                        />
                                                                    </Box>
                                                                )}
                                                                <Box className={styles.fileNameCont}>
                                                                    {file?.path || file?.filename}
                                                                </Box>
                                                                <CloseButton
                                                                    style={{
                                                                        top: 10,
                                                                        right: 10,
                                                                    }}
                                                                    onclick={(e) => {
                                                                        e.stopPropagation();

                                                                        let uploadingFileIndex =
                                                                            uploadedFiles?.findIndex(
                                                                                (item) => item.name === file.name,
                                                                            );
                                                                        setUploadedFiles(
                                                                            uploadedFiles?.filter(
                                                                                (_, i) => i !== uploadingFileIndex,
                                                                            ) as [],
                                                                        );
                                                                    }}
                                                                />
                                                            </SwiperSlide>
                                                        );
                                                    },
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
                            error={touched.postContent && errors.postContent}
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
    );
}
