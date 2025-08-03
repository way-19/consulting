import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TranslationRequest {
  messageId: string;
  originalText: string;
  sourceLang: string;
  targetLang: string;
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { messageId, originalText, sourceLang, targetLang }: TranslationRequest = await req.json()

    // Skip translation if languages are the same
    if (sourceLang === targetLang) {
      await supabaseClient
        .from('messages')
        .update({
          translation_status: 'not_needed',
          needs_translation: false
        })
        .eq('id', messageId)

      return new Response(
        JSON.stringify({ success: true, message: 'Translation not needed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get DeepL API key from environment
    const deepLApiKey = Deno.env.get('DEEPL_API_KEY')
    if (!deepLApiKey) {
      throw new Error('DeepL API key not configured')
    }

    // Map language codes to DeepL format
    const mapLanguageCode = (lang: string): string => {
      const langMap: Record<string, string> = {
        'en': 'EN',
        'tr': 'TR',
        'de': 'DE',
        'fr': 'FR',
        'es': 'ES',
        'it': 'IT',
        'pt': 'PT',
        'ru': 'RU',
        'ja': 'JA',
        'zh': 'ZH'
      }
      return langMap[lang] || 'EN'
    }

    // Translate using DeepL API
    const deepLResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${deepLApiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'text': originalText,
        'source_lang': mapLanguageCode(sourceLang),
        'target_lang': mapLanguageCode(targetLang),
        'preserve_formatting': '1'
      })
    })

    if (!deepLResponse.ok) {
      throw new Error(`DeepL API error: ${deepLResponse.status}`)
    }

    const translationData: DeepLResponse = await deepLResponse.json()
    const translatedText = translationData.translations[0]?.text

    if (!translatedText) {
      throw new Error('No translation received from DeepL')
    }

    // Update message with translation
    const { error: updateError } = await supabaseClient
      .from('messages')
      .update({
        translated_message: translatedText,
        translated_language: targetLang,
        translation_status: 'completed',
        needs_translation: false
      })
      .eq('id', messageId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        translatedText,
        detectedSourceLanguage: translationData.translations[0]?.detected_source_language?.toLowerCase()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Translation error:', error)

    // Mark translation as failed
    if (req.method === 'POST') {
      try {
        const { messageId } = await req.json()
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabaseClient
          .from('messages')
          .update({
            translation_status: 'failed',
            needs_translation: false
          })
          .eq('id', messageId)
      } catch (updateError) {
        console.error('Error updating failed translation status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})