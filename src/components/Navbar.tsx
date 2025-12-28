'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.content}`}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          PORTFOLIO
        </Link>

        <button
          className={`${styles.burger} ${isMenuOpen ? styles.burgerActive : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navActive : ''}`}>
          <Link href="/#posts" className={styles.link} onClick={closeMenu}>
            Posts
          </Link>
          <Link href="/projects" className={styles.link} onClick={closeMenu}>
            Projects
          </Link>
          {user ? (
            <Link href="/admin" className={styles.loginBtn} onClick={closeMenu}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className={styles.loginBtn} onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
