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
  private baseUrl = 'https://api-free.deepl.com/v2/translate';

  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('DeepL API key not found. Translation features will be disabled.');
    }
  }

  async translateText(text: string, targetLanguage: 'TR' | 'PT'): Promise<TranslationResult> {
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
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLanguage,
          source_lang: 'EN',
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

  async translateMultiple(texts: string[], targetLanguage: 'TR' | 'PT'): Promise<{ [key: string]: string }> {
    const results: { [key: string]: string } = {};
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      if (text && text.trim()) {
        const result = await this.translateText(text, targetLanguage);
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

  async translateServiceContent(serviceData: {
    title: string;
    description: string;
    meta_description?: string;
    meta_keywords?: string[];
  }, targetLanguage: 'TR' | 'PT') {
    const textsToTranslate = [
      serviceData.title,
      serviceData.description,
      serviceData.meta_description || '',
      ...(serviceData.meta_keywords || [])
    ];

    const translations = await this.translateMultiple(textsToTranslate, targetLanguage);
    
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
  }, targetLanguage: 'TR' | 'PT') {
    const textsToTranslate = [faqData.question, faqData.answer];
    const translations = await this.translateMultiple(textsToTranslate, targetLanguage);
    
    return {
      question: translations.text_0 || faqData.question,
      answer: translations.text_1 || faqData.answer
    };
  }
}

export const deepLTranslator = new DeepLTranslator();