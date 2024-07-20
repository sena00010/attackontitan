import styles from "./createPost.module.css";

interface PostCreatedProps {
  opened: boolean;
  setOpenPost: (open: boolean) => void;
}

export default function PostCreated({ opened, setOpenPost }: PostCreatedProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setOpenPost(false); 
  };

  return (
    opened ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.textAreaInput}
              type="text"
              placeholder="Ne paylaşmak istersiniz?"
            />
            <input
              className={styles.textAreaInput}
              type="text"
              placeholder="Paylaşmak istediğiniz fotoğrafın linkini ekler misiniz?"
            />
            <button className={styles.submitButton} type="submit">
              Gönder
            </button>
          </form>
        </div>
      </div>
    ) : null
  );
}
