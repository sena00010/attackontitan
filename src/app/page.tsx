import styles from "./page.module.css";
import TitleComp from "@/component/title";
import Character from "../component/topic";

export default function Home() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.erenYeager}>
          You have the freedom to defend the world's freedom and I have the
          freedom to continue moving forward.
        </div>
      </div>
      <TitleComp />
      <Character/>
    </div>
  );
}
