# cveditor

Interactive CV builder built with React + Vite + Tailwind. Pick a template, edit inline, download as PDF.

## Develop

```bash
cd cv-builder
npm install
npm run dev
```

## Build & deploy

```bash
cd cv-builder
npm run build
# then upload dist/ to host, or:
SFTP_HOST=... SFTP_USER=... SFTP_PASS=... node scripts/deploy.mjs
```

Deployed to https://make-tutors.com/cv-editor/
