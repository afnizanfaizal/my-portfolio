'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/login');
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (loading) {
        return <div className={styles.layout}><div style={{ margin: 'auto' }}>Loading admin...</div></div>;
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>AF</div>
                    <span className={styles.logoText}>Studio</span>
                </div>

                <div className={styles.navSection}>
                    <Link href="/admin" className={pathname === '/admin' ? styles.navItemActive : styles.navItem}>
                        <span className={styles.navIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </span>
                        Dashboard
                    </Link>
                </div>

                <div className={styles.navGroup}>
                    <h3 className={styles.groupTitle}>CONTENT</h3>
                    <Link href="/admin/posts" className={pathname.startsWith('/admin/posts') ? styles.navItemActive : styles.navItem}>
                        <span className={styles.navIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </span>
                        Posts
                    </Link>
                    <Link href="/admin/categories" className={pathname === '/admin/categories' ? styles.navItemActive : styles.navItem}>
                        <span className={styles.navIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </span>
                        Categories
                    </Link>
                    <Link href="/admin/tags" className={pathname === '/admin/tags' ? styles.navItemActive : styles.navItem}>
                        <span className={styles.navIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        </span>
                        Tags
                    </Link>
                </div>

                <div className={styles.navGroup}>
                    <h3 className={styles.groupTitle}>CONFIGURATION</h3>
                    <Link href="/admin/appearance" className={pathname === '/admin/appearance' ? styles.navItemActive : styles.navItem}>
                        <span className={styles.navIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                        </span>
                        Appearance
                    </Link>
                    <Link href="/admin/settings" className={pathname === '/admin/settings' ? styles.navItemActive : styles.navItem}>
                        <span className={styles.navIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1V11a2 2 0 0 1-2-2 2 2 0 0 1 2-2v-.09A1.65 1.65 0 0 0 5.4 5a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </span>
                        Settings
                    </Link>
                </div>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <span className={styles.navIcon}>🚪</span>
                    Log Out
                </button>
            </aside>

            <div className={styles.contentArea}>
                <header className={styles.topHeader}>
                    <div className={styles.breadcrumbs}>
                        <span className={styles.breadcrumbItem}>Admin</span>
                        <span className={styles.separator}>/</span>
                        <span className={styles.breadcrumbActive}>
                            {pathname === '/admin' ? 'Dashboard' :
                                pathname.startsWith('/admin/posts') ? 'Posts' :
                                    pathname.startsWith('/admin/categories') ? 'Categories' :
                                        pathname.startsWith('/admin/tags') ? 'Tags' :
                                            pathname.startsWith('/admin/appearance') ? 'Appearance' :
                                                pathname.startsWith('/admin/settings') ? 'Settings' : 'Overview'}
                        </span>
                    </div>

                    <div className={styles.headerActions}>
                        <a href="/" target="_blank" className={styles.viewSiteBtn}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View Site
                        </a>
                    </div>
                </header>

                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
}
