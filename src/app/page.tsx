import Image from "next/image";
import styles from "./page.module.css";
import HeaderComp from "../component/topic";
import TitleComp from "@/component/title";

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
      <HeaderComp />
    </div>
  );
}