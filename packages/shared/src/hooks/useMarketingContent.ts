import { useState, useEffect } from 'react';
import { supabase } from '@consulting19/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketingContent {
  id: string;
  page_key: string;
  content_en: Record<string, any>;
  content_tr?: Record<string, any>;
  content_pt?: Record<string, any>;
  meta_title_en?: string;
  meta_description_en?: string;
  meta_keywords_en?: string;
  meta_title_tr?: string;
  meta_description_tr?: string;
  meta_keywords_tr?: string;
  meta_title_pt?: string;
  meta_description_pt?: string;
  meta_keywords_pt?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface UseMarketingContentResult {
  content: Record<string, any> | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function useMarketingContent(pageKey: string): UseMarketingContentResult {
  const { language } = useLanguage();
  const [data, setData] = useState<MarketingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: contentData, error: fetchError } = await supabase
          .from('marketing_pages')
          .select('*')
          .eq('page_key', pageKey)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching marketing content:', fetchError);
          setError('Failed to load content');
          return;
        }

        setData(contentData);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageKey]);

  // Get localized content based on current language
  const getLocalizedContent = (): Record<string, any> | null => {
    if (!data) return null;

    switch (language) {
      case 'tr':
        return data.content_tr && Object.keys(data.content_tr).length > 0 
          ? data.content_tr 
          : data.content_en;
      case 'pt':
        return data.content_pt && Object.keys(data.content_pt).length > 0 
          ? data.content_pt 
          : data.content_en;
      default:
        return data.content_en;
    }
  };

  const getLocalizedMeta = (field: 'title' | 'description' | 'keywords'): string | null => {
    if (!data) return null;

    const enField = `meta_${field}_en` as keyof MarketingContent;
    const trField = `meta_${field}_tr` as keyof MarketingContent;
    const ptField = `meta_${field}_pt` as keyof MarketingContent;

    switch (language) {
      case 'tr':
        return (data[trField] as string) || (data[enField] as string) || null;
      case 'pt':
        return (data[ptField] as string) || (data[enField] as string) || null;
      default:
        return (data[enField] as string) || null;
    }
  };

  return {
    content: getLocalizedContent(),
    metaTitle: getLocalizedMeta('title'),
    metaDescription: getLocalizedMeta('description'),
    metaKeywords: getLocalizedMeta('keywords'),
    imageUrl: data?.image_url || null,
    loading,
    error,
  };
}