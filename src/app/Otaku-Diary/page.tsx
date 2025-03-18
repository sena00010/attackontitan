"use client";
import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function OtakuDiaryPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [newPost, setNewPost] = useState('');

    // Örnek günlük gönderileri
    const diaryPosts = [
        {
            id: 1,
            author: "RamenLover",
            avatar: "https://i.pinimg.com/564x/77/12/7b/77127b22b41f89503d93b73627e14d73.jpg",
            category: "Ramen Rotası",
            title: "İstanbul'da Bulduğum En İyi Ramen: Miso Ramen Bar",
            date: "14 Mart 2025",
            location: "İstanbul, Kadıköy",
            content: "Kadıköy'de yeni keşfettiğim bu ramen dükkanı gerçekten harika! Tonkotsu ramen özellikle mükemmeldi...",
            images: [
                "https://i.pinimg.com/564x/b3/66/e8/b366e8b776d2f51aff0ea18e645d68b0.jpg",
                "https://i.pinimg.com/564x/d9/9a/a8/d99aa8f2c01ca6dc53693f58b7634d87.jpg"
            ],
            rating: 4.5,
            likes: 67,
            comments: 12,
            shares: 5,
            tags: ["Ramen", "Japon Mutfağı", "Kadıköy", "İstanbul"]
        },
        // Diğer gönderiler buraya...
    ];

    // Kategori listesi
    const categories = [
        { value: 'all', label: 'Tümü' },
        { value: 'ramen', label: 'Ramen Rotası' },
        { value: 'event', label: 'Etkinlik İzlenimleri' },
        { value: 'collection', label: 'Koleksiyon Vitrini' },
        { value: 'manga-cafe', label: 'Manga Kafeler' },
        { value: 'japanese', label: 'Japonca Öğrenme' },
    ];

    return (
        <div className={styles.container}>
            {/* Sayfa Başlığı */}
            <div className={styles.header}>
                <div className={styles.logoIcon}></div>
                <h1 className={styles.title}>✨ Otaku Günlüğü ✨</h1>
                <p className={styles.subtitle}>
                    Anime severlerin gerçek dünya deneyimlerini paylaştığı, keşiflerin ve tavsiyelerin buluşma noktası!
                </p>
            </div>

            {/* Kategori Filtreleri */}
            <div className={styles.categoryFilters}>
                {categories.map(category => (
                    <label key={category.value} className={styles.categoryLabel}>
                        <input
                            type="radio"
                            name="category"
                            value={category.value}
                            checked={activeCategory === category.value}
                            onChange={() => setActiveCategory(category.value)}
                            className={styles.categoryInput}
                        />
                        <span className={styles.categoryText}>{category.label}</span>
                    </label>
                ))}
            </div>

            {/* Yeni Günlük Oluşturma Formu */}
            <div className={styles.newPostForm}>
                <div className={styles.formHeader}>
                    <div className={styles.userInfo}>
                        <img src="https://i.pinimg.com/564x/77/12/7b/77127b22b41f89503d93b73627e14d73.jpg" alt="User" className={styles.userAvatar} />
                        <span className={styles.userName}>Deneyimini Paylaş</span>
                    </div>
                    <div className={styles.formBadge}>Yeni Günlük</div>
                </div>

                <textarea
                    placeholder="Anime/Manga dünyası ile ilgili deneyimini burada paylaş..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className={styles.postTextarea}
                ></textarea>

                <div className={styles.formActions}>
                    <div className={styles.mediaButtons}>
                        <button className={styles.mediaButton}>📷</button>
                        <button className={styles.mediaButton}>📍</button>
                        <button className={styles.mediaButton}>😊</button>
                        <button className={styles.mediaButton}>⭐</button>
                    </div>
                    <button className={styles.shareButton}>Paylaş</button>
                </div>
            </div>

            {/* Günlük Gönderileri */}
            <div className={styles.postsGrid}>
                {diaryPosts.map(post => (
                    <Link href={`/Otaku-Diary/${post.id}`} key={post.id} className={styles.postCard}>
                        <div className={styles.postHeader}>
                            <div className={styles.postAuthor}>
                                <img src={post.avatar} alt={post.author} className={styles.authorAvatar} />
                                <div>
                                    <div className={styles.authorName}>{post.author}</div>
                                    <div className={styles.postMeta}>
                                        <span>{post.date}</span> •
                                        <span>{post.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.postCategory}>{post.category}</div>
                        </div>

                        <h2 className={styles.postTitle}>{post.title}</h2>

                        <div className={styles.postRating}>
                            {'★'.repeat(Math.floor(post.rating))}
                            {'☆'.repeat(5 - Math.floor(post.rating))}
                            <span>{post.rating.toFixed(1)}</span>
                        </div>

                        <div className={styles.postImages}>
                            {post.images.map((img, index) => (
                                <img key={index} src={img} alt={`Image ${index + 1}`} className={styles.postImage} />
                            ))}
                        </div>

                        <p className={styles.postContent}>{post.content}</p>

                        <div className={styles.postTags}>
                            {post.tags.map((tag, idx) => (
                                <span key={idx} className={styles.postTag}>#{tag}</span>
                            ))}
                        </div>

                        <div className={styles.postFooter}>
                            <button className={styles.likeButton}>❤️ {post.likes}</button>
                            <button className={styles.commentButton}>💬 {post.comments}</button>
                            <button className={styles.shareButton}>🔄 {post.shares}</button>
                        </div>
                    </Link>
                ))}
            </div>

            <button className={styles.loadMoreButton}>Daha Fazla Göster</button>
        </div>
    );
}