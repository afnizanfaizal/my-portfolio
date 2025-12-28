'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost, deletePost } from '@/lib/posts';
import {
    getDailyStats,
    getCountryStats,
    getTopPosts,
    DailyStats,
    CountryStat,
    PostView
} from '@/lib/analytics';
import { VisitorChart, CountryStats, TopPostsList } from './components/AnalyticsCharts';
import styles from './admin.module.css';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        posts: 0,
        categories: 0,
        views: '0'
    });
    const [analytics, setAnalytics] = useState<{
        daily: DailyStats[];
        countries: CountryStat[];
        topPosts: PostView[];
    }>({
        daily: [],
        countries: [],
        topPosts: []
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        setLoading(true);
        try {
            const [postsData, categoriesData, daily, countries, top] = await Promise.all([
                import('@/lib/posts').then(m => m.getAllPosts()),
                import('@/lib/taxonomy').then(m => m.getCategories()),
                getDailyStats(),
                getCountryStats(),
                getTopPosts(5)
            ]);

            const totalViews = daily.reduce((acc, curr) => acc + curr.visits, 0);

            setStats({
                posts: postsData.length,
                categories: categoriesData.length,
                views: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString()
            });

            setAnalytics({
                daily,
                countries,
                topPosts: top
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

    return (
        <div className={styles.dashboardGrid}>
            <div className={styles.mainCol}>
                <section className={styles.welcomeSection}>
                    <div className={styles.welcomeText}>
                        <h1>Welcome back, Admin.</h1>
                        <p>Here&apos;s what&apos;s happening with your portfolio today.</p>
                    </div>
                    <Link href="/admin/posts/new" className={styles.btnNewPost}>
                        <span>+</span> New Post
                    </Link>
                </section>

                <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </div>
                            <span className={styles.statTrend}>Live</span>
                        </div>
                        <div className={styles.statValue}>{stats.views}</div>
                        <div className={styles.statLabel}>Total Views</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <span className={styles.statTrendMuted}>Posts</span>
                        </div>
                        <div className={styles.statValue}>{stats.posts}</div>
                        <div className={styles.statLabel}>Published Posts</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <span className={styles.statTrendMuted}>Categories</span>
                        </div>
                        <div className={styles.statValue}>{stats.categories}</div>
                        <div className={styles.statLabel}>Active Categories</div>
                    </div>
                </section>

                <div style={{ marginTop: '2.5rem' }}>
                    <VisitorChart data={analytics.daily} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2.5rem', marginTop: '2.5rem' }}>
                    <CountryStats data={analytics.countries} />
                    <TopPostsList data={analytics.topPosts} />
                </div>
            </div>
        </div>
    );
}
