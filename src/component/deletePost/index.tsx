import { deleteDoc, doc, getFirestore } from "@firebase/firestore";
import { app } from "@/app/layout";

const db = getFirestore(app);

const DeletePost = async (postId: string, fetchPosts: () => Promise<void>) => {
  console.log(postId,"postId")
  console.log(fetchPosts,"fetchPosts")

  const postRef = doc(db, "post", postId);
  try {
    await deleteDoc(postRef);
    console.log(`Proje ${postId} başarıyla silindi`);
    await fetchPosts();
  } catch (e) {
    console.error("Proje silinirken hata oluştu: ", e);
  }
};

export default DeletePost;
