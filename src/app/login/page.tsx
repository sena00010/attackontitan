import styles from "./login.module.css";
export default function LoginPage() {
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
              <form className={styles.formıtems}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Kullanıcı adı"
                  name="username"
                />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Şifre"
                  name="password"
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
LoginPage;
