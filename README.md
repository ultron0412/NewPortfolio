# Ayush Jung Kunwar - Portfolio

Simple, responsive portfolio website built from `Ayush_Jung_Kunwar_CV.docx`.

## Run locally

Open `index.html` directly in a browser, or use a local static server:

```bash
npx serve .
```

## Deploy

This is a static site and can be deployed directly to:
- GitHub Pages
- Netlify
- Vercel (static mode)

## Project Structure

- `.vscode/settings.json` - local editor defaults
- `assets/app.css` - bundled stylesheet entrypoint (utility + canvas + theme styles)
- `assets/style.css` - main site styling
- `assets/utility.css` - utility and reset helpers
- `assets/canvas.css` - canvas/background styling
- `assets/javasc.js` - UI interactions (reveal animation + nav state)
- `assets/canvas.js` - particle canvas engine
- `assets/certificates/` - certificate SVG/PDF assets used in the Certifications section
- `particles.js` - particle bootstrap file
- `index.html` - site structure and CV content
