'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';
import { getAllPosts, BlogPost } from '@/lib/posts';
import styles from './page.module.css';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const posts = await getAllPosts();
                // Filter posts that have "Projects" category
                const filtered = posts.filter(post =>
                    post.categories?.some(cat => cat.toLowerCase() === 'projects')
                );
                setProjects(filtered);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    return (
        <div className={styles.page}>
            <section className={styles.heroSection}>
                <div className="container">
                    <span className={styles.label}>Portfolio</span>
                    <h1 className="heading-xl">My Projects</h1>
                    <p className={styles.description}>
                        A showcase of my recent work in AI, strategy, and ecosystem development.
                    </p>
                </div>
            </section>

            <section className={styles.gridSection}>
                <div className="container">
                    {loading ? (
                        <div className={styles.status}>Loading projects...</div>
                    ) : projects.length > 0 ? (
                        <div className={styles.grid}>
                            {projects.map((project) => (
                                <PostCard key={project.id} post={project} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.status}>
                            <p>No projects found in the "Projects" category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
