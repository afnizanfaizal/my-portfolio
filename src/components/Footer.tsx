'use client';

import { useEffect, useState } from 'react';
import { SiteSettings, getSettings } from '@/lib/settings';
import styles from './Footer.module.css';

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        async function loadSettings() {
            const data = await getSettings();
            setSettings(data);
        }
        loadSettings();
    }, []);

    const socialLinks = settings?.socialLinks || {};

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                <div className={styles.top}>
                    <div>
                        <h3 className={styles.ctaHeading}>Let&apos;s build something together.</h3>
                        <p className={styles.ctaText}>
                            I&apos;m currently available for freelance projects and open to new opportunities. Feel free to reach out.
                        </p>
                    </div>
                    <div className={styles.socials}>
                        {socialLinks?.linkedin && (
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">LI</a>
                        )}
                        {socialLinks?.facebook && (
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">FB</a>
                        )}
                        {socialLinks?.instagram && (
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">IG</a>
                        )}
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {new Date().getFullYear()} DR AFNIZANFAIZAL. All rights reserved.</p>
                    <p>Designed & Built with Vanilla CSS</p>
                </div>
            </div>
        </footer>
    );
}
