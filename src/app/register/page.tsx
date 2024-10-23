"use client"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import styles from "./register.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import { setDoc, doc, getFirestore } from "firebase/firestore";

export default function RegisterPage() {
  const firebaseConfig = {
    apiKey: "AIzaSyBrCP4cdAO3iugcXw_3tC-P7Tc6ejaHcn4",
    authDomain: "animepression.firebaseapp.com",
    databaseURL: "https://animepression-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "animepression",
    storageBucket: "animepression.appspot.com",
    messagingSenderId: "443513559646",
    appId: "1:443513559646:web:b9876ea8b060b6aa82b2cf",
    measurementId: "G-Z2X190YYL9",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    birthday: "",
    favoriteAnimes: "",
    favoriteMangas: "",
    userHobbies: "",
    userInfo: "",
    userName: "",
    userNickname: "",
    userProfilePictures: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          await setDoc(doc(db, "user", user.uid), {
            uid: user.uid, 
            email: formData.email,
            phone: formData.phone,
            birthday: formData.birthday,
            favoriteAnimes: formData.favoriteAnimes,
            favoriteMangas: formData.favoriteMangas,
            userHobbies: formData.userHobbies,
            userInfo: formData.userInfo,
            userName: formData.userName,
            userNickname: formData.userNickname,
            userProfilePictures: formData.userProfilePictures
          });
          console.log("Document written with ID: ", user.uid);
          console.log(user);
          router.push('/login');
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        console.log(formData, 'formData');
        const errorMessage = error.message;
        console.log('errorMessage', errorMessage);
        if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
          alert('Bu mail zaten var');
        } else {
          alert(errorMessage);
        }
      });
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.firstPart}>
          <div className={styles.secondPart}>
            <div className={styles.app}>
              <div>
                <img
                  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdgHRAqgPlHvk3rIxvLJw6_Wl5hwMoFdD69w&usqp=CAU"}
                  alt="Logo"
                />
              </div>
              <h1 className={styles.title}>Register!</h1>
              <form className={styles.formıtems}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Cep Telefonu"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  className={styles.input}
                  placeholder="BirthDay"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Favorite Animes"
                  name="favoriteAnimes"
                  value={formData.favoriteAnimes}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Favorite Mangas"
                  name="favoriteMangas"
                  value={formData.favoriteMangas}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="User Hobbies"
                  name="userHobbies"
                  value={formData.userHobbies}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="User Info"
                  name="userInfo"
                  value={formData.userInfo}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="User Name"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="User Nickname"
                  name="userNickname"
                  value={formData.userNickname}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="User Profile Pictures"
                  name="userProfilePictures"
                  value={formData.userProfilePictures}
                  onChange={handleChange}
                />
                <div className={styles.buttonContainer}>
                  <button className={styles.button} onClick={handleSubmit} type="submit">
                    Hesap Oluştur!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
