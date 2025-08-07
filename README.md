consulting

## Country Panel Replication

Once the `/ge` (Georgia) panel is complete and stable, it should be used as the template for other country panels such as `/usa`, `/uk`, etc. Clone the `/ge` directory and adjust content, logic, and AI context accordingly for each country. Avoid duplicating placeholder components.

New countries can be added via the Admin Panel → "Add Country" page. Each country entry should include:
- name (e.g., Spain)
- code (e.g., es)
- flag_emoji (e.g., 🇪🇸)

Ensure all new panels use `country_id` and `flag_emoji` for dynamic configuration.
