'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost, BlogPost } from '@/lib/posts';
import PostForm from '@/components/PostForm';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function loadPost() {
            try {
                const data = await getPostById(id);
                if (data) {
                    setPost(data);
                } else {
                    alert('Post not found');
                    router.push('/admin');
                }
            } catch (error) {
                console.error('Failed to load post:', error);
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [id, router]);

    const handleSubmit = async (data: Omit<BlogPost, 'id' | 'createdAt'>) => {
        setSaving(true);
        try {
            await updatePost(id, data);
            router.push('/admin');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to update post:', error);
            alert(`Error updating post: ${error.message || 'Unknown error'}. Check browser console for details.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading post data...</div>;

    // Use the 'key' prop to force PostForm to re-initialize its internal state
    // when the 'post' data changes (i.e., after it's fetched).
    // This is a common pattern when a child component's internal state
    // needs to be reset based on asynchronously loaded props.
    return (
        <PostForm
            key={post?.id}
            title="Edit Post"
            initialData={post}
            onSubmit={handleSubmit}
            loading={saving}
        />
    );
}
