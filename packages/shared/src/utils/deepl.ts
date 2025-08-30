interface DeepLTranslationResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

interface TranslationResult {
  success: boolean;
  translatedText?: string;
  error?: string;
}

class DeepLTranslator {
  private apiKey: string;
  private baseUrl = 'https://api-free.deepl.com/v2';

  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('DeepL API key not found. Translation features will be disabled.');
    }
  }

  async translateText(text: string, sourceLang: string = 'EN', targetLang: 'TR' | 'PT'): Promise<TranslationResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'DeepL API key not configured'
      };
    }

    if (!text.trim()) {
      return {
        success: false,
        error: 'No text provided for translation'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLang,
          source_lang: sourceLang,
          preserve_formatting: '1',
          formality: 'default'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepL API error:', response.status, errorText);
        return {
          success: false,
          error: `Translation failed: ${response.status} ${response.statusText}`
        };
      }

      const data: DeepLTranslationResponse = await response.json();
      
      if (data.translations && data.translations.length > 0) {
        return {
          success: true,
          translatedText: data.translations[0].text
        };
      } else {
        return {
          success: false,
          error: 'No translation received from DeepL'
        };
      }
    } catch (error) {
      console.error('DeepL translation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown translation error'
      };
    }
  }

  async translate(text: string, sourceLang: string = 'EN', targetLang: 'TR' | 'PT'): Promise<string> {
    const result = await this.translateText(text, sourceLang, targetLang);
    if (result.success && result.translatedText) {
      return result.translatedText;
    }
    return text; // Fallback to original text
  }

  async translateMultiple(texts: string[], targetLang: 'TR' | 'PT'): Promise<{ [key: string]: string }> {
    const results: { [key: string]: string } = {};
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      if (text && text.trim()) {
        const result = await this.translateText(text, 'EN', targetLang);
        if (result.success && result.translatedText) {
          results[`text_${i}`] = result.translatedText;
        } else {
          console.warn(`Failed to translate text ${i}:`, result.error);
          results[`text_${i}`] = text; // Fallback to original text
        }
        
        // Add small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  async translateJsonContent(jsonContent: Record<string, any>, targetLang: 'TR' | 'PT'): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(jsonContent)) {
      if (typeof value === 'string' && value.trim()) {
        const translationResult = await this.translateText(value, 'EN', targetLang);
        result[key] = translationResult.success ? translationResult.translatedText : value;
        
        // Add small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } else if (Array.isArray(value)) {
        result[key] = [];
        for (const item of value) {
          if (typeof item === 'string' && item.trim()) {
            const translationResult = await this.translateText(item, 'EN', targetLang);
            result[key].push(translationResult.success ? translationResult.translatedText : item);
            await new Promise(resolve => setTimeout(resolve, 100));
          } else if (typeof item === 'object' && item !== null) {
            const translatedItem = await this.translateJsonContent(item, targetLang);
            result[key].push(translatedItem);
          } else {
            result[key].push(item);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        result[key] = await this.translateJsonContent(value, targetLang);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }

  async translateMarketingContent(contentData: {
    content_en: Record<string, any>;
    meta_title_en?: string;
    meta_description_en?: string;
    meta_keywords_en?: string;
  }, targetLang: 'TR' | 'PT') {
    const translatedContent = await this.translateJsonContent(contentData.content_en, targetLang);
    
    const metaTitle = contentData.meta_title_en 
      ? await this.translate(contentData.meta_title_en, 'EN', targetLang)
      : '';
    
    const metaDescription = contentData.meta_description_en 
      ? await this.translate(contentData.meta_description_en, 'EN', targetLang)
      : '';
    
    const metaKeywords = contentData.meta_keywords_en 
      ? await this.translate(contentData.meta_keywords_en, 'EN', targetLang)
      : '';
    
    return {
      content: translatedContent,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
    };
  }

  async translateServiceContent(serviceData: {
    title: string;
    description: string;
    meta_description?: string;
    meta_keywords?: string[];
  }, targetLang: 'TR' | 'PT') {
    const textsToTranslate = [
      serviceData.title,
      serviceData.description,
      serviceData.meta_description || '',
      ...(serviceData.meta_keywords || [])
    ];

    const translations = await this.translateMultiple(textsToTranslate, targetLang);
    
    return {
      title: translations.text_0 || serviceData.title,
      description: translations.text_1 || serviceData.description,
      meta_description: translations.text_2 || serviceData.meta_description,
      meta_keywords: serviceData.meta_keywords?.map((_, index) => 
        translations[`text_${index + 3}`] || serviceData.meta_keywords![index]
      ) || []
    };
  }

  async translateFAQContent(faqData: {
    question: string;
    answer: string;
  }, targetLang: 'TR' | 'PT') {
    const textsToTranslate = [faqData.question, faqData.answer];
    const translations = await this.translateMultiple(textsToTranslate, targetLang);
    
    return {
      question: translations.text_0 || faqData.question,
      answer: translations.text_1 || faqData.answer
    };
  }
}

export const deepLTranslator = new DeepLTranslator();