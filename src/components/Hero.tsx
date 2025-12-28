'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSettings, SiteSettings } from '@/lib/settings';
import styles from './Hero.module.css';

export default function Hero() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        async function load() {
            const data = await getSettings();
            setSettings(data);
        }
        load();
    }, []);

    const heroLabel = settings?.heroLabel || 'STRATEGIC AI ECOSYSTEM SPECIALIST';
    const heroTitle = settings?.heroTitle || 'DR AFNIZANFAIZAL';
    const heroSubtitle = settings?.heroSubtitle || 'Inspiring future through advanced AI solutions, from predictive analytics to autonomous systems, that deliver measurable results.';

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.content}`}>
                <div className={styles.textSide}>
                    <span className={styles.label}>{heroLabel}</span>
                    <h1 className={`heading-xl ${styles.title}`}>
                        {heroTitle}
                    </h1>
                    <p className={styles.description}>
                        {heroSubtitle}
                    </p>
                    <div className={styles.actions}>
                        <Link href="#posts" className="btn btn-primary">
                            Read Blog
                        </Link>
                        {settings?.socialLinks.linkedin && (
                            <Link href={settings.socialLinks.linkedin} target="_blank" className="btn btn-outline">
                                LinkedIn
                            </Link>
                        )}
                    </div>
                </div>

                <div className={styles.imageSide}>
                    <div className={styles.glow} />
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/profile.jpg"
                            alt="Alex - Web Developer"
                            width={400}
                            height={400}
                            className={styles.image}
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
