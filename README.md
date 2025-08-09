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
