'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, BlogPost } from '@/lib/posts';
import PostForm from '@/components/PostForm';

export default function NewPostPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data: Omit<BlogPost, 'id' | 'createdAt'>) => {
        setLoading(true);
        try {
            await createPost(data);
            router.push('/admin');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to create post:', error);
            alert(`Error creating post: ${error.message || 'Unknown error'}. Check browser console for details.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PostForm
            title="Create New Post"
            onSubmit={handleSubmit}
            loading={loading}
        />
    );
}
