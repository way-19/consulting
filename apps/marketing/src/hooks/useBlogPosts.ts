import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title_i18n: any;
  excerpt_i18n: any;
  content_i18n: any;
  slug: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  view_count: number;
  author: {
    full_name: string;
    company: string;
  };
  created_at: string;
}

export const useBlogPosts = (countryCode?: string, limit?: number) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [countryCode, limit]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:user_profiles!blog_posts_author_id_fkey(full_name, company)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      // Filter by country if specified
      if (countryCode) {
        query = query.eq('country_code', countryCode);
      }

      // Limit results if specified
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        setError(error.message);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (content: any, field: string, fallback: string = '') => {
    if (!content || typeof content !== 'object') return fallback;
    // For now, prioritize English, but this can be extended for multi-language support
    return content.en || content.tr || content.pt || fallback;
  };

  const incrementViewCount = async (slug: string) => {
    try {
      await supabase.rpc('increment_blog_post_views', { post_slug: slug });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  return {
    posts,
    loading,
    error,
    getLocalizedContent,
    incrementViewCount,
    refetch: fetchPosts,
  };
};

export default useBlogPosts;