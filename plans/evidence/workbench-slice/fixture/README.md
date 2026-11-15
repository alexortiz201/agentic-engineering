# Synthetic slug fixture

No external services, dependencies, credentials or production data.

Implement `slug(value)` in `slug.mjs`: require a string (otherwise throw TypeError); lowercase; replace each run of characters other than ASCII letters/digits with a hyphen; strip leading/trailing hyphens. Empty or punctuation-only input returns an empty string. This deliberately does not transliterate Unicode.

Only `slug.mjs` may change. Tests and this context are protected inputs. Independently run `node --test slug.test.mjs` and `node --check slug.mjs`. A passing suite is not human acceptance or shipping authority.
