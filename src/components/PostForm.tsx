'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BlogPost } from '@/lib/posts';
import styles from './PostForm.module.css';
import RichTextEditor from './RichTextEditor';
import { useAuth } from '@/lib/hooks/useAuth';
import { Taxonomy, getCategories, getTags } from '@/lib/taxonomy';
import { useEffect } from 'react';

interface PostFormProps {
    initialData?: BlogPost | null;
    onSubmit: (data: Omit<BlogPost, 'id' | 'createdAt'>) => Promise<void>;
    loading: boolean;
    title: string;
}

export default function PostForm({ initialData, onSubmit, loading, title }: PostFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        coverImage: initialData?.coverImage || '',
    });
    const [contentSize, setContentSize] = useState(0);
    const [sizeWarning, setSizeWarning] = useState(false);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [currentTag, setCurrentTag] = useState('');

    const [availableCategories, setAvailableCategories] = useState<Taxonomy[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || []);
    const [availableTags, setAvailableTags] = useState<Taxonomy[]>([]);

    useEffect(() => {
        async function fetchTaxonomies() {
            try {
                const [cats, tgs] = await Promise.all([getCategories(), getTags()]);
                setAvailableCategories(cats);
                setAvailableTags(tgs);
            } catch (error) {
                console.error('Failed to fetch taxonomies:', error);
            }
        }
        fetchTaxonomies();
    }, []);

    useEffect(() => {
        // Estimate payload size (Firestore limit is 1MB)
        const payload = JSON.stringify({
            ...formData,
            tags,
            categories: selectedCategories
        });
        const size = payload.length; // Approximate bytes for UTF-16 strings
        setContentSize(size);
        setSizeWarning(size > 800000); // Warn at 800KB
    }, [formData, tags, selectedCategories]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'title' && !initialData && !formData.slug) {
            const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: autoSlug }));
        }
    };

    const handleAddTag = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (currentTag.trim()) {
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const toggleCategory = (categoryName: string) => {
        const isProjects = categoryName.toLowerCase() === 'projects';

        setSelectedCategories(prev => {
            if (isProjects) {
                // If checking Projects, remove everything else
                // If unchecking Projects, it just becomes empty
                return prev.includes(categoryName) ? [] : [categoryName];
            } else {
                // If checking something else, and Projects is already there, remove Projects
                const filtered = prev.filter(c => c.toLowerCase() !== 'projects');
                return prev.includes(categoryName)
                    ? filtered.filter(c => c !== categoryName)
                    : [...filtered, categoryName];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final size check
        if (contentSize > 1000000) {
            alert(`⚠️ CONTENT TOO LARGE: Your post is approximately ${(contentSize / (1024 * 1024)).toFixed(2)}MB, which exceeds Firestore's 1MB limit. This usually happens because of large images pasted directly into the editor. Please use external image URLs or upload smaller images.`);
            return;
        }

        await onSubmit({
            ...formData,
            tags,
            categories: selectedCategories,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.header}>
                <h1>{title}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" className={styles.btnPreview}>Preview</button>
                </div>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.mainCol}>
                    <div className={styles.titleSection}>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={styles.titleInput}
                            placeholder="Add title"
                            required
                        />
                    </div>

                    <div className={styles.editorWrapper}>
                        {contentSize > 1000000 && (
                            <div className={styles.criticalWarning} style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                <strong>⚠️ Post Too Large:</strong> You have exceeded the 1MB Firestore limit. This is usually caused by large images pasted directly into the editor. Please remove the images and use "Featured Image" or paste direct image URLs instead.
                            </div>
                        )}
                        <RichTextEditor
                            value={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Start writing your awesome story..."
                        />
                    </div>

                    <section className={styles.excerptSection}>
                        <label>Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            className={styles.excerptTextarea}
                            placeholder="Write a short summary..."
                        />
                        <p className={styles.excerptHelp}>
                            Excerpts are optional hand-crafted summaries of your content that can be used in your theme.
                        </p>
                    </section>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>
                            Publish
                            <span style={{ cursor: 'pointer', opacity: 0.5 }}>▼</span>
                        </div>
                        <div className={styles.widgetBody}>
                            <div className={styles.publishMeta}>
                                {/* Meta rows removed for cleaner UI */}
                            </div>
                            <div className={styles.publishActions}>
                                <button type="button" className={styles.btnSaveDraft}>Save Draft</button>
                                <button type="submit" className={styles.btnPublish} disabled={loading || contentSize > 1000000}>
                                    {loading ? 'Saving...' : 'Publish'}
                                </button>
                            </div>
                            {contentSize > 0 && (
                                <div className={styles.sizeIndicator} style={{
                                    color: contentSize > 1000000 ? '#ef4444' : (sizeWarning ? '#f59e0b' : '#6b7280'),
                                    fontSize: '0.75rem',
                                    marginTop: '0.75rem',
                                    textAlign: 'center',
                                    fontWeight: 500
                                }}>
                                    Payload Size: {(contentSize / 1024).toFixed(1)} KB / 1024 KB
                                    {sizeWarning && <div style={{ marginTop: '0.25rem' }}>⚠️ Approaching limit!</div>}
                                </div>
                            )}
                        </div>
                        <div className={styles.widgetFooter}>
                            <button type="button" className={styles.btnTrash}>Move to Trash</button>
                        </div>
                    </div>

                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>Categories</div>
                        <div className={styles.widgetBody}>
                            <div className={styles.tabs}>
                                <span className={`${styles.tab} ${styles.tabActive}`}>All</span>
                                <span className={styles.tab}>Most Used</span>
                            </div>
                            <div className={styles.categoryList}>
                                {availableCategories.length === 0 ? (
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-muted)' }}>No categories found. Create some in the Categories manager.</p>
                                ) : (
                                    availableCategories.map(cat => {
                                        const isProjectsSelected = selectedCategories.some(c => c.toLowerCase() === 'projects');
                                        const isThisCategoryProjects = cat.name.toLowerCase() === 'projects';
                                        const isDisabled = isProjectsSelected && !isThisCategoryProjects;

                                        return (
                                            <label
                                                key={cat.id}
                                                className={styles.categoryItem}
                                                style={{ opacity: isDisabled ? 0.4 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat.name)}
                                                    onChange={() => toggleCategory(cat.name)}
                                                    disabled={isDisabled}
                                                />
                                                {cat.name}
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                            <button type="button" className={styles.btnAddCategory} onClick={() => window.open('/admin/categories', '_blank')}>+ Add New Category</button>
                        </div>
                    </div>

                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>Tags</div>
                        <div className={styles.widgetBody}>
                            <div className={styles.tagInputBox}>
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    className={styles.tagInput}
                                    placeholder="Add new tag"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                />
                                <button type="button" className={styles.btnAddTag} onClick={handleAddTag}>Add</button>
                            </div>
                            <div className={styles.tagsDisplay}>
                                {tags.map((tag, index) => (
                                    <span key={index} className={styles.tag}>
                                        {tag}
                                        <span className={styles.removeTag} onClick={() => removeTag(tag)}>×</span>
                                    </span>
                                ))}
                            </div>

                            {availableTags.length > 0 && (
                                <div className={styles.mostUsedTags}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Choose from most used tags:</p>
                                    <div className={styles.tagCloud}>
                                        {availableTags.slice(0, 10).map(tag => (
                                            <span
                                                key={tag.id}
                                                className={styles.tagLink}
                                                onClick={() => !tags.includes(tag.name) && setTags([...tags, tag.name])}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className={styles.tagHelp}>Separate tags with commas.</p>
                        </div>
                    </div>

                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>Featured Image</div>
                        <div className={styles.widgetBody}>
                            <div className={styles.tagInputBox}>
                                <input
                                    type="url"
                                    placeholder="Paste image URL (Unsplash, etc.)"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                                    className={styles.tagInput}
                                />
                                <button type="button" className={styles.btnAddTag}>Set</button>
                            </div>
                            <p className={styles.tagHelp}>Paste a direct link to an image.</p>

                            {formData.coverImage && (
                                <div className={styles.imagePreview}>
                                    <img
                                        src={formData.coverImage}
                                        alt="Featured"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 'inherit'
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}
