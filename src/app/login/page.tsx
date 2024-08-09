'use client'
import { useState, useEffect } from "react";
import { app } from "../layout";
import styles from "./login.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms/userAtoms';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const db = getFirestore(app);

  // Sayfa yüklendiğinde, localStorage'dan kullanıcıyı çek
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        
        // Kullanıcı verilerini Firestore'dan çek
        const userDoc = doc(db, "user", user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = { id: userSnapshot.id, ...userSnapshot.data() } as User;
          
          // Kullanıcı verilerini atom'a ve localStorage'a setle
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.error("User data not found");
        }
        
        router.push('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        console.log(formData.email, formData.password);
        if(errorMessage === 'Firebase: Error (auth/invalid-credential).'){
          alert('GEÇERSİZ BİR E-MAİL VEYA ŞİFRE');
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
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdgHRAqgPlHvk3rIxvLJw6_Wl5hwMoFdD69w&usqp=CAU"
                  }
                />{" "}
              </div>
              <h1 className={styles.title}>Sign Up!</h1>
              <form className={styles.formıtems} onSubmit={handleSubmit}>
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
                <div className={styles.buttonContainer}>
                  <button className={styles.button} type="submit">
                    Giriş Yap
                  </button>
                </div>
              </form>
              <div>
                <a className={styles.aHref} href="../register/">
                  Hesabınız yok mu? Kayıt olun.
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
