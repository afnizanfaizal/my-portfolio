'use client';

import { useState, useEffect } from 'react';
import { SiteSettings, getSettings, updateSettings } from '@/lib/settings';
import adminStyles from '../admin.module.css';
import taxonomyStyles from '../taxonomy.module.css';

export default function AppearancePage() {
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
        setSettings(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        setSaving(true);
        try {
            await updateSettings(settings);
            setMessage('Appearance saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save appearance:', error);
            alert('Error saving appearance.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading appearance settings...</div>;

    return (
        <div className={taxonomyStyles.container}>
            <div className={taxonomyStyles.header}>
                <h1>Home Page Appearance</h1>
            </div>

            <form onSubmit={handleSubmit} className={taxonomyStyles.form} style={{ maxWidth: '600px' }}>
                <div className={taxonomyStyles.formGroup}>
                    <label>Hero Label</label>
                    <input
                        type="text"
                        name="heroLabel"
                        value={settings?.heroLabel}
                        onChange={handleChange}
                        className={taxonomyStyles.input}
                        placeholder="e.g. STRATEGIC AI ECOSYSTEM"
                        required
                    />
                    <p className={taxonomyStyles.helpText}>
                        The small uppercase text that appears above the main title.
                    </p>
                </div>

                <div className={taxonomyStyles.formGroup}>
                    <label>Hero Title</label>
                    <input
                        type="text"
                        name="heroTitle"
                        value={settings?.heroTitle}
                        onChange={handleChange}
                        className={taxonomyStyles.input}
                        placeholder="e.g. DR AFNIZANFAIZAL"
                        required
                    />
                    <p className={taxonomyStyles.helpText}>
                        The main large heading of your hero section.
                    </p>
                </div>

                <div className={taxonomyStyles.formGroup}>
                    <label>Hero Subtitle / Tagline</label>
                    <textarea
                        name="heroSubtitle"
                        value={settings?.heroSubtitle}
                        onChange={handleChange}
                        className={taxonomyStyles.textarea}
                        placeholder="Describe your vision or expertise..."
                        required
                    />
                    <p className={taxonomyStyles.helpText}>
                        A short description that explains your work and measurable results.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                    <button type="submit" className={taxonomyStyles.btnSubmit} disabled={saving}>
                        {saving ? 'Updating...' : 'Update Appearance'}
                    </button>
                    {message && <span style={{ color: '#00cc66', fontWeight: 600, fontSize: '0.875rem' }}>{message}</span>}
                </div>
            </form>
        </div>
    );
}
