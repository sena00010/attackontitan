import {
  faImage,
  faPaperPlane,
  faXmark,
  faHeart,
  faStar,
  faMagic
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import styles from "./createPost.module.css";

interface PostCreatedProps {
  opened: boolean;
  setOpenPost: (open: boolean) => void;
}

export default function PostCreated({ opened, setOpenPost }: PostCreatedProps) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firebaseConfig = {
    apiKey: "AIzaSyBrCP4cdAO3iugcXw_3tC-P7Tc6ejaHcn4",
    authDomain: "animepression.firebaseapp.com",
    databaseURL:
        "https://animepression-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "animepression",
    storageBucket: "animepression.appspot.com",
    messagingSenderId: "443513559646",
    appId: "1:443513559646:web:b9876ea8b060b6aa82b2cf",
    measurementId: "G-Z2X190YYL9",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth();
  const storage = getStorage(app);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Kullanıcı kimliği ve oluşturulma zamanı ekleniyor
      const userId = auth.currentUser?.uid || "anonymous";
      const createdAt = new Date().toISOString();

      let imageUrl = "";

      // If there's an image file, upload it to Firebase Storage
      if (imageFile) {
        const storageRef = ref(
            storage,
            `post-images/${userId}/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const sendPost = {
        postContent: { text: text, image: imageUrl },
        userId: userId,
        createdAt: createdAt,
        selfReaction: false,
        likeCount: 0,
      };

      const postDoc = await addDoc(collection(db, "post"), sendPost);
      console.log("Post ID'si: ", postDoc.id);

      // Formu sıfırla ve modalı kapat
      setText("");
      setImageFile(null);
      setPreviewUrl("");
      setOpenPost(false);
    } catch (e) {
      console.error("Post eklenirken hata oluştu: ", e);
    } finally {
      setIsLoading(false);
    }
  };


  return opened ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Yeni Gönderi Oluştur</h2>
            <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setOpenPost(false)}
                className={styles.closeIcon}
            />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
              className={styles.textAreaInput}
              placeholder="Anime dünyasında bugün ne paylaşmak istersiniz? 🌟"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
          />

            {previewUrl ? (
                <div className={styles.imagePreviewContainer}>
                  <img
                      src={previewUrl}
                      alt="Preview"
                      className={styles.imagePreview}
                  />
                  <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={removeImage}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
            ) : (
                <div className={styles.uploadContainer} onClick={handleImageClick}>
                  <FontAwesomeIcon icon={faImage} className={styles.uploadIcon} />
                  <p>Bir resim eklemek için tıklayın 🎨</p>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className={styles.hiddenInput}
            />

            <button
                className={styles.submitButton}
                type="submit"
                disabled={isLoading}
            >
              {isLoading ? (
                  <span className={styles.loadingSpinner}></span>
              ) : (
                  <>
                    <span>Gönder</span>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <FontAwesomeIcon icon={faMagic} style={{ marginLeft: '2px' }} />
                  </>
              )}
            </button>
          </form>
        </div>
      </div>
  ) : null;
}