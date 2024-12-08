import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./createPost.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface PostCreatedProps {
  opened: boolean;
  setOpenPost: (open: boolean) => void;
}

export default function PostCreated({ opened, setOpenPost }: PostCreatedProps) {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Kullanıcı kimliği ve oluşturulma zamanı ekleniyor
    const userId = auth.currentUser?.uid || "anonymous"; // Giriş yapılmamışsa 'anonymous' olarak ayarla
    const createdAt = new Date().toISOString(); // ISO formatında tarih

    const sendPost = {
      postContent: { text: text, image: photo },
      userId: userId,
      createdAt: createdAt,
    };

    try {
      const postDoc = await addDoc(collection(db, "post"), sendPost);
      console.log("Post ID'si: ", postDoc.id);
    } catch (e) {
      console.error("Post eklenirken hata oluştu: ", e);
    }

    // Formu sıfırla ve modalı kapat
    setText("");
    setPhoto("");
    setOpenPost(false);
  };

  return opened ? (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => setOpenPost(false)}
          className={styles.closeIcon}
        />
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.textAreaInput}
            type="text"
            placeholder="Ne paylaşmak istersiniz?"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          <input
            className={styles.textAreaInput}
            type="text"
            placeholder="Paylaşmak istediğiniz fotoğrafın linkini ekler misiniz?"
            value={photo}
            onChange={(e) => setPhoto(e.currentTarget.value)}
          />
          <button className={styles.submitButton} type="submit">
            Gönder
          </button>
        </form>
      </div>
    </div>
  ) : null;
}
