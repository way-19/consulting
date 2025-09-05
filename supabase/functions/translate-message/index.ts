import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const DEEPL_KEY = "0f51365f-a19a-4b9f-88cb-1f47f24a300a:fx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: corsHeaders }
      );
    }

    const { text, target_lang } = await req.json();

    // Validate input
    if (!text || !target_lang) {
      return new Response(
        JSON.stringify({ error: "Missing text or target_lang" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`🌐 Translating: "${text.substring(0, 50)}..." to ${target_lang}`);

    // Call DeepL API
    const deeplResponse = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `text=${encodeURIComponent(text)}&target_lang=${target_lang.toUpperCase()}`
    });

    if (!deeplResponse.ok) {
      const errorText = await deeplResponse.text();
      console.error("❌ DeepL API error:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "DEEPL_API_ERROR", 
          details: errorText,
          status: deeplResponse.status 
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const deeplData = await deeplResponse.json();
    
    if (!deeplData.translations || !deeplData.translations[0]) {
      console.error("❌ Invalid DeepL response:", deeplData);
      return new Response(
        JSON.stringify({ error: "INVALID_DEEPL_RESPONSE" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const translatedText = deeplData.translations[0].text;
    console.log(`✅ Translation successful: "${translatedText.substring(0, 50)}..."`);

    return new Response(
      JSON.stringify({ 
        translated: translatedText,
        original: text,
        target_language: target_lang 
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("💥 Translation function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "TRANSLATION_FAILED", 
        details: error.message 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});