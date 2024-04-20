import styles from "./createPost.module.css";
import {Modal} from "@mantine/core";
import {Formik} from "formik";
import {notifications} from "@mantine/notifications";
import '@mantine/dropzone/styles.css';
import {useState} from "react";
import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
interface Character {
    opened: boolean;
    submitFunc:any;
    setClosed:React.Dispatch<React.SetStateAction<boolean>>
}

export default function PostCreated({opened,setClosed,submitFunc}:Character ){
    const [uploadedImages, setUploadedImages] = useState<[]>(
        [],
    );
    const [uploadedFiles, setUploadedFiles] = useState<[]>(
        [],
    );
    return (
        opened &&
        (
            <Modal
                opened={opened}
                onClose={() => setClosed}
                title="Gönderi Ekle!"
                classNames={{
                    title: styles.title,
                }}
                zIndex={1001}
                centered
                size={600}
            >
                <Formik
                    initialValues={{
                        postContent:'',
                        postImage: [],

                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        notifications.show({
                            id: 'submitting-form',
                            loading: true,
                            message:
                                'Dosyalarınızda güvenlik taraması yapılıyor. Verilerin boyutlarına göre işlem süresi uzun olabilir. Lütfen bekleyiniz... ',
                            autoClose: false,
                            withCloseButton: false,
                        });
                        await submitFunc(values, uploadedImages, uploadedFiles);
                        setSubmitting(false);
                        setUploadedImages([]);
                    }}

                >
                    <Dropzone
                    onDrop={(files) => console.log('accepted files', files)}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <IconUpload
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                stroke={1.5}
                            />
                        </Dropzone.Idle>
                        <div>
                            <Text size="xl" inline>
                                Drag images here or click to select files
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                                Attach as many files as you like, each file should not exceed 5mb
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
                    <textarea name="postContent" placeholder={'Gönderi Metni'}></textarea>
                </Formik>
            </Modal>
        )
    )
}
