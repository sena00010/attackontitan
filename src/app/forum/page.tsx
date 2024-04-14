import styles from "./page.module.css";
import ForumDataFetch from "@/component/forumDataFetch";
export default function ForumPage() {
  return (
    <div>
      <div className={styles.container}>
          <ForumDataFetch/>
      </div>
    </div>
  );
}
ForumPage;
