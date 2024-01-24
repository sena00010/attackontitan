import styles from "./register.module.css";
export default function RegisterPage() {
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
              <h1 className={styles.title}>Register!</h1>
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
                  placeholder="Şifre oluşturunuz"
                  name="password"
                />
                <input
                  type=""
                  className={styles.input}
                  placeholder="Cep Telefonu"
                  name="password"
                />
                <input
                  type="date"
                  className={styles.input}
                  placeholder="BirthDay"
                  name="password"
                />
                <div className={styles.buttonContainer}>
                  <button className={styles.button} type="submit">
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
RegisterPage;
