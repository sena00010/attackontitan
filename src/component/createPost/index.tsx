import styles from "./createPost.module.css";
import { Modal, Textarea } from "@mantine/core";
import { Formik } from "formik";
import { notifications } from "@mantine/notifications";
import "@mantine/dropzone/styles.css";
import { useState } from "react";
import { Group, Text, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
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
  return (
    <Modal
      opened={opened}
      onClose={() => setClosed}
      style={{ textAlign: "center" }}
      title="Gönderi Ekle!"
      classNames={{
        title: styles.title,
      }}
      centered
    >
      <Formik
        initialValues={{
          postContent: "",
          postImage: [],
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
        <div className={styles.container}>
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-dimmed)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>
          </Dropzone>
          <Textarea name="postContent" placeholder={"Gönderi Metni"}></Textarea>
        </div>
      </Formik>
    </Modal>
  );
}
