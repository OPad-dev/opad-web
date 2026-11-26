# opad-web

Website for [OPad](https://github.com/OPad-dev/OPad): the landing page (English at `/`, Spanish at `/es/`) and the documentation (`/docs/`, `/es/docs/`). Built with Astro and Starlight.

## Develop

Requires Node 22 or newer and git.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm test
```

`npm run dev` and `npm run build` first run:

- `scripts/sync-docs.mjs`: copies the docs from the [OPad repository](https://github.com/OPad-dev/OPad) into `src/content/docs/`.
- `scripts/sync-model.mjs`: converts the case model from the same repository into `public/models/`.

The OPad repository is the source of truth: both scripts fetch it from GitHub (branch `main`, as a sparse clone in `.cache/opad`) and overwrite the copies on every run. The copies are committed as a backup, so the site still builds offline; `opad-source.json` records the OPad commit they come from. Don't edit them here: edit the docs in the OPad repository (each docs page has an "Edit page" link to its file there).

The docs sync also checks every link: a link to a page or repository file that doesn't exist stops the build, with a list of what to fix in the OPad repository.

To preview docs you haven't pushed yet, point `$OPAD_REPO_DIR` at a local checkout of OPad.

## Pending

What is still needed to finish the site (in Spanish): [PENDIENTE.md](PENDIENTE.md).
