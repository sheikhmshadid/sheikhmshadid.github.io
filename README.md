# Sheikh's personal page

A self-contained, responsive portfolio. Open `index.html` directly, or serve this folder with `python -m http.server 4173` and visit http://localhost:4173. No installation or build step is needed.

All site files and assets live in this folder. The portrait is a copy of `2024Portfolio/images/pic01.jpg`; that portfolio was not used as a design reference. Switzer is self-hosted with its license in `assets/`.

The project panels contain real screenshots captured from localhost on September 12, 2026 (Cieve re-captured in dark mode on September 13). Cieve shows Sheikh's signed-in library; the content dashboard shows its saved shared post pool. Click either screenshot to view it at full size. Project links point to the GitHub repositories. The contact link opens an email to sheikhmshadid@gmail.com for design and development inquiries.

Browser checks live in `verify.cjs`. Run `node verify.cjs` with Playwright available, or pass the path to an existing Playwright installation as the first argument. `CHROME_PATH` can select an installed Chromium executable. The check creates full-page previews at four viewport widths and verifies screenshot links, scoped project palettes, navigation, images, and horizontal overflow.

## Design plan

Audience: designers seeking a collaborator who can design and implement a complete product. Goal: explore two selected projects and get in touch. Content: introduction, Cieve, content studio for @ninetyfourohfive, bio, contact.

The portfolio retains its white and blue palette and self-hosted Switzer. Project identities apply only within their own sections through `projects.css`: Cieve uses its original dark burgundy #1A0403, peach #FEDEAE, secondary ink #E99672, Gambarino wordmark, and small radii; the content dashboard uses #FCFCFC, black, square edges, and its original Archivo Narrow heading face. Each card pairs a prominent project identity and short introduction with an angled, framed screenshot, followed by the project description. Mobile stacks the identity above the screenshot. Font licenses are in `assets/`. The hero, about, and contact sections retain their original styling.

## Local screenshot sessions

`local-frontends.mjs` serves the original frontend sources with caches inside `.runtime/`. API copies and their configuration also live in `.runtime/`, which is ignored along with `.capture-profile/`. These folders are local-only and must not be deployed. For hosting, upload only `index.html`, `style.css`, `projects.css`, and `assets/`.

`capture-projects.cjs` opens a dedicated browser for signing in to the real apps. No account data is fabricated. The original project source directories are not edited.
