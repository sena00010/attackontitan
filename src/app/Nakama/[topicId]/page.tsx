"use client";
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function ForumTopicPage() {
    const params = useParams();
    const router = useRouter();
    const topicId = params.topicId;
    const [commentText, setCommentText] = useState('');

    // Örnek konu verisi (Gerçek uygulamada bu API'den çekilecektir)
    const topicData = {
        id: topicId,
        title: "Demon Slayer Final Sezonu Hakkında Düşünceleriniz",
        author: "SakuraMochi",
        avatar: "https://i.pinimg.com/736x/22/b8/e1/22b8e1e238b5c3b27c7340b0bbe71a59.jpg",
        date: "12 Mart 2025 • 14:30",
        content: `Merhaba arkadaşlar! Demon Slayer'ın final sezonunu izleyen var mı? Bence şimdiye kadarki en iyi sezonlardan biri oldu.

Ne düşünüyorsunuz? Sizce hikayeyi iyi bir şekilde sonlandırdılar mı? Animasyon kalitesi gerçekten inanılmazdı, özellikle son savaş sahneleri nefes kesiciydi! 🔥

En sevdiğiniz sahne hangisiydi? Bence Tanjiro'nun son tekniği muhteşemdi!`,
        tags: ["Demon Slayer", "Final Sezonu", "Kimetsu no Yaiba"],
        likes: 48,
        bookmarks: 12,
        shares: 9,
        comments: [
            {
                id: 1,
                author: "KawaiiOtaku",
                avatar: "https://i.pinimg.com/736x/4b/2a/8a/4b2a8a4469b1856c34048f7f7c5746b0.jpg",
                date: "12 Mart 2025 • 15:06",
                content: "Tamamen katılıyorum! Özellikle Nezuko'nun son halinin görüldüğü sahneler beni çok etkiledi. Ufotable gerçekten kendini aştı bu sezonda! 😍",
                likes: 15
            },
            {
                id: 2,
                author: "TanjiroFan",
                avatar: "https://i.pinimg.com/564x/28/3a/89/283a89b09342b6b5c7b9ca37e5aaa548.jpg",
                date: "12 Mart 2025 • 16:22",
                content: "Bence final biraz aceleye getirilmişti. Manga'da daha fazla detay vardı, ama yine de animasyon kalitesi sayesinde çoğu şeyi affedebiliyorum. Emeği geçen herkese teşekkürler! 🙏",
                likes: 8
            },
            {
                id: 3,
                author: "ZenitsuLover",
                avatar: "https://i.pinimg.com/564x/ca/70/c5/ca70c55ca267f573b92e45fe0e01f4a6.jpg",
                date: "12 Mart 2025 • 18:42",
                content: "Zenitsu'nun son savaşı beni ağlattı 😭 Karakterin gelişimi ilk sezondan bu yana inanılmazdı. Bu anime gerçekten özel bir yere sahip olacak hep.",
                likes: 27
            }
        ]
    };

    return (
        <div className={styles.container}>
            {/* Geri butonu */}
            <div className={styles.topBar}>
                <button
                    className={styles.backButton}
                    onClick={() => router.push('/Nakama')}
                >
                    ← Otaku Meydanı'na Dön
                </button>
                <div className={styles.topicTags}>
                    {topicData.tags.map((tag, idx) => (
                        <span key={idx} className={styles.topicTag}>{tag}</span>
                    ))}
                </div>
            </div>

            {/* Ana Konu */}
            <div className={styles.mainTopic}>
                <div className={styles.topicHeader}>
                    <div className={styles.authorInfo}>
                        <img src={topicData.avatar} alt={topicData.author} className={styles.authorAvatar} />
                        <div>
                            <div className={styles.authorName}>{topicData.author}</div>
                            <div className={styles.topicDate}>{topicData.date}</div>
                        </div>
                    </div>
                    <button className={styles.bookmarkButton}>🔖</button>
                </div>

                <h1 className={styles.topicTitle}>{topicData.title}</h1>

                <div className={styles.topicContent}>
                    {topicData.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>

                <div className={styles.topicActions}>
                    <div className={styles.actionButtons}>
                        <button className={styles.likeButton}>❤️ Beğen • {topicData.likes}</button>
                        <button className={styles.commentButton}>💬 Yorumlar • {topicData.comments.length}</button>
                    </div>
                    <button className={styles.shareButton}>🔄 Paylaş</button>
                </div>
            </div>

            {/* Yorumlar Bölümü */}
            <div className={styles.commentsSection}>
                <h2 className={styles.commentsTitle}>Cevaplar ({topicData.comments.length})</h2>

                {/* Yorum Listesi */}
                <div className={styles.commentsList}>
                    {topicData.comments.map(comment => (
                        <div key={comment.id} className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                                <div className={styles.commentAuthor}>
                                    <img src={comment.avatar} alt={comment.author} className={styles.commentAvatar} />
                                    <div>
                                        <div className={styles.commentAuthorName}>{comment.author}</div>
                                        <div className={styles.commentDate}>{comment.date}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.commentBody}>
                                {comment.content}
                            </div>

                            <div className={styles.commentActions}>
                                <button className={styles.commentLikeButton}>❤️ Beğen • {comment.likes}</button>
                                <button className={styles.commentReplyButton}>💬 Yanıtla</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Yorum Yapma Formu */}
                <div className={styles.commentForm}>
                    <img
                        src="https://i.pinimg.com/564x/77/12/7b/77127b22b41f89503d93b73627e14d73.jpg"
                        alt="Kullanıcı"
                        className={styles.userAvatar}
                    />
                    <div className={styles.commentInputArea}>
                        <h3 className={styles.replyTitle}>Cevabınızı Yazın</h3>
                        <textarea
                            placeholder="Düşüncelerinizi burada paylaşın..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.currentTarget.value)}
                            className={styles.commentTextarea}
                        ></textarea>
                        <button
                            className={styles.submitButton}
                            disabled={!commentText.trim()}
                        >
                            Gönder →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}