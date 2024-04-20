"use client"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import styles from "./register.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { app } from "../layout";

export default function RegisterPage() {
  const auth = getAuth(app);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    birthday: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, formData.email, formData.password,)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
        router.push('/login');
        // ...
      })
      .catch((error) => {
        console.log(formData,'formData')
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorMessage',errorMessage);
        if(errorMessage==='Firebase: Error (auth/email-already-in-use).'){
          alert('Bu mail zaten var')
        }else{
          alert(errorMessage)
        }
        // ..
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
              <form className={styles.formıtems} >
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
