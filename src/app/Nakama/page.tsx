"use client";
import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function ForumPage() {
    const [activeTab, setActiveTab] = useState('tartışmalar');

    // Forum konuları
    const forumTopics = [
        {
            id: 1,
            title: "İlkbahar 2025 Sezonunun En İyi Animesi Hangisi?",
            author: "KawaiiOtaku",
            avatar: "https://i.pinimg.com/736x/4b/2a/8a/4b2a8a4469b1856c34048f7f7c5746b0.jpg",
            category: "Tartışmalar",
            tags: ["2025", "Bahar Sezonu", "Yeni Animeler"],
            replies: 42,
            views: 568,
            lastUpdate: "15 dk önce"
        },
        // Diğer konular buraya...
    ];

    return (
        <div className={styles.container}>
            {/* Forum Başlığı */}
            <div className={styles.header}>
                <h1 className={styles.title}>Otaku Meydanı</h1>

                {/* Arama ve Konu Açma */}
                <div className={styles.actions}>
                    <input type="text" placeholder="Forum içinde ara..." className={styles.searchInput} />
                    <button className={styles.newTopicButton}>Yeni Konu Aç</button>
                </div>

                {/* Kategori Sekmeleri */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'tartışmalar' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('tartışmalar')}
                    >
                        Anime Tartışmaları
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'off-topic' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('off-topic')}
                    >
                        Off-Topic
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'discord' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('discord')}
                    >
                        Discord <span className={styles.badge}>12</span>
                    </button>
                </div>
            </div>

            {/* Forum Konuları */}
            <div className={styles.topicsContainer}>
                {/* Başlık Satırı */}
                <div className={styles.topicHeader}>
                    <div className={styles.topicTitle}>Konu Başlığı</div>
                    <div className={styles.topicReplies}>Yanıtlar</div>
                    <div className={styles.topicViews}>Görüntüleme</div>
                    <div className={styles.topicLastUpdate}>Son Güncelleme</div>
                </div>

                {/* Konu Listesi */}
                {forumTopics.map(topic => (
                    <Link href={`/Nakama/${topic.id}`} key={topic.id}>
                        <div className={styles.topicItem}>
                            <div className={styles.topicInfo}>
                                <img src={topic.avatar} alt={topic.author} className={styles.avatar} />
                                <div>
                                    <h3>{topic.title}</h3>
                                    <div className={styles.topicMeta}>
                                        <span>{topic.author}</span>
                                        {topic.tags.map((tag, idx) => (
                                            <span key={idx} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.topicStats}>
                                <div className={styles.replyCount}>{topic.replies}</div>
                                <div className={styles.viewCount}>{topic.views}</div>
                                <div className={styles.lastUpdate}>{topic.lastUpdate}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}