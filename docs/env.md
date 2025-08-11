# Supabase Environment

Set these variables in both your local `.env` file and Netlify environment settings.

```ini
VITE_SUPABASE_URL=https://fwgaekupwecsruxjebb.supabase.co
VITE_SUPABASE_FUNCTIONS_URL=https://fwgaekupwecsruxjebb.supabase.co/functions/v1
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z2Fla3Vwd2Vjc3J1eGplYmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTQyNjEsImV4cCI6MjA2OTQ3MDI2MX0.HzssNASnDherzWBjEmoNtrsmqDRW03-bzSbN1w7xYEY
```

`VITE_SUPABASE_FUNCTIONS_URL` is optional. If omitted, the app will default to `${VITE_SUPABASE_URL}/functions/v1`.
