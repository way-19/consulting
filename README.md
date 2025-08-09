consulting

## Country Panel Replication

Once the `/ge` (Georgia) panel is complete and stable, it should be used as the template for other country panels such as `/usa`, `/uk`, etc. Clone the `/ge` directory and adjust content, logic, and AI context accordingly for each country. Avoid duplicating placeholder components.

New countries can be added via the Admin Panel → "Add Country" page. Each country entry should include:
- name (e.g., Spain)
- code (e.g., es)
- flag_emoji (e.g., 🇪🇸)

Ensure all new panels use `country_id` and `flag_emoji` for dynamic configuration.

## Country Slug Normalization & Deployment

- Georgia's slug is always `georgia`; the shorter `ge` form is not used.
- The `normalizeCountrySlug` function ensures routes resolve to either `georgia` or `global`.
- Netlify uses the `_redirects` file to serve SPA routes for deep links.
- Incrementing the `CACHE_NAME` in `public/sw.js` invalidates old service workers. Users may need to hard-refresh after deployment.

## Supabase Data Integrity

- Georgia's country record must use the slug `georgia`; legacy `ge` values should be avoided.
- Consultant dashboards rely on the `consultant_country_assignments` and `applications` tables to link consultants, countries and clients.
- Run periodic checks or migrations to ensure no `ge` slugs remain in the database.

## Country Content Management

Consultants can manage the public site for each country via the **Country Content Management** module at `/[country-slug]/consultant-dashboard/country-content`.

### Managing Content

- **Services** – create, edit and delete service offerings for a country. Each service stores a `language`, `title`, `description`, optional `image_url`, `features[]` and `slug` in the `country_services` table.
- **FAQs** – manage frequently asked questions per country and language in the `country_faqs` table.
- **Haberler & Blog** – publish news or blog posts with title, slug, excerpt, content, cover image and status. Posts are saved in `country_news` with a `language` column.
- **SEO & Meta** – edit `meta_title`, `meta_description` and `meta_keywords` for the Home, Services, FAQs and Blog pages. Data lives in `country_meta` keyed by `country_id`, `page` and `language`.

### Multi-language Support

All content forms include a language selector (currently `tr` and `en`). Translations are stored as separate rows per language. When a translation is missing the frontend can fall back to the default language.

### Notes

- The module loads only the countries assigned to the logged-in consultant. If no countries are assigned, a friendly message is displayed.
- Test accounts remain available for demo/login, but all operational data is stored in Supabase tables mentioned above.

## Environment variables & Deploy notes

Set the following variables for deployments (e.g., Netlify → Site settings → Build & deploy → Environment):

```
VITE_SUPABASE_URL = https://fwgaekupwecsruxjebb.supabase.co
VITE_SUPABASE_ANON_KEY = <anon_jwt>
VITE_SUPABASE_FUNCTIONS_URL = https://fwgaekupwecsruxjebb.supabase.co/functions/v1
```

After setting these, redeploy the site so Vite injects them into the bundle.
