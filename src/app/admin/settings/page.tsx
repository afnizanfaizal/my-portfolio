'use client';

import { useState, useEffect } from 'react';
import { SiteSettings, getSettings, updateSettings } from '@/lib/settings';
import adminStyles from '../admin.module.css';
import taxonomyStyles from '../taxonomy.module.css';

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function loadSettings() {
            const data = await getSettings();
            setSettings(data);
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const platform = name.replace('social_', '');
            setSettings(prev => prev ? {
                ...prev,
                socialLinks: { ...prev.socialLinks, [platform]: value }
            } : null);
        } else {
            setSettings(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        setSaving(true);
        try {
            await updateSettings(settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

    return (
        <div className={taxonomyStyles.container}>
            <div className={taxonomyStyles.header}>
                <h1>Site Settings</h1>
            </div>

            <form onSubmit={handleSubmit} className={taxonomyStyles.form} style={{ maxWidth: '800px' }}>
                <div className={taxonomyStyles.formGroup}>
                    <label>Site Title</label>
                    <input
                        type="text"
                        name="siteTitle"
                        value={settings?.siteTitle}
                        onChange={handleChange}
                        className={taxonomyStyles.input}
                        required
                    />
                    <p className={taxonomyStyles.helpText}>
                        The main title of your website, used for SEO and in the browser tab.
                    </p>
                </div>

                <div className={taxonomyStyles.formGroup}>
                    <label>Site Description</label>
                    <textarea
                        name="siteDescription"
                        value={settings?.siteDescription}
                        onChange={handleChange}
                        className={taxonomyStyles.textarea}
                        required
                    />
                    <p className={taxonomyStyles.helpText}>
                        A detailed description of your site for search engines.
                    </p>
                </div>

                <div className={taxonomyStyles.formGroup}>
                    <label>Admin Email</label>
                    <input
                        type="email"
                        name="adminEmail"
                        value={settings?.adminEmail}
                        onChange={handleChange}
                        className={taxonomyStyles.input}
                    />
                    <p className={taxonomyStyles.helpText}>
                        Notifications and contact form submissions will be sent here.
                    </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Social Links</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className={taxonomyStyles.formGroup}>
                            <label>LinkedIn URL</label>
                            <input
                                type="text"
                                name="social_linkedin"
                                value={settings?.socialLinks.linkedin}
                                onChange={handleChange}
                                className={taxonomyStyles.input}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className={taxonomyStyles.formGroup}>
                            <label>Facebook URL</label>
                            <input
                                type="text"
                                name="social_facebook"
                                value={settings?.socialLinks.facebook}
                                onChange={handleChange}
                                className={taxonomyStyles.input}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className={taxonomyStyles.formGroup}>
                            <label>Instagram URL</label>
                            <input
                                type="text"
                                name="social_instagram"
                                value={settings?.socialLinks.instagram}
                                onChange={handleChange}
                                className={taxonomyStyles.input}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>
                    <p className={taxonomyStyles.helpText} style={{ marginTop: '0.75rem' }}>
                        Links to your professional and social profiles.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                    <button type="submit" className={taxonomyStyles.btnSubmit} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {message && <span style={{ color: '#00cc66', fontWeight: 600, fontSize: '0.875rem' }}>{message}</span>}
                </div>
            </form>
        </div>
    );
}
