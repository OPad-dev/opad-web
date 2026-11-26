# opad-web

Website for [OPad](https://github.com/OPad-dev/OPad): the landing page (English at `/`, Spanish at `/es/`) and the documentation (`/docs/`, `/es/docs/`). Built with Astro and Starlight.

## Develop

Requires Node 22 or newer and a checkout of the OPad repository next to this one (`../OPad-docs` by default).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm test
```

`npm run dev` and `npm run build` first run:

- `scripts/sync-docs.mjs`: copies the docs from `$OPAD_DOCS_DIR` (default `../OPad-docs/docs`) into `src/content/docs/`. The copies are not committed.
- `scripts/sync-model.mjs`: converts the case model from `$OPAD_REPO_DIR` (default `../OPad-docs`) into `public/models/`.

## Pending

What is still needed to finish the site (in Spanish): [PENDIENTE.md](PENDIENTE.md).
