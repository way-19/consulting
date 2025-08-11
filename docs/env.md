# Supabase Environment

Set these variables in both your local `.env` file and Netlify environment settings.

```ini
VITE_SUPABASE_URL=https://fwgaekupwecsruxjebb.supabase.co
VITE_SUPABASE_FUNCTIONS_URL=https://fwgaekupwecsruxjebb.supabase.co/functions/v1
VITE_SUPABASE_ANON_KEY=... (from the same project)
```

`VITE_SUPABASE_FUNCTIONS_URL` is optional. If omitted, the app will default to `${VITE_SUPABASE_URL}/functions/v1`.
