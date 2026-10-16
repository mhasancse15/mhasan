# Mahmudul Hasan: Portfolio

React + TypeScript + Vite + Tailwind CSS v4. All content is in `src/data.ts`; the CV is `public/Mahmudul-Hasan-CV.pdf`.

## Run locally
```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Publish on GitHub Pages
1. Create a new empty repository on github.com. Name it `mhasancse15.github.io` for a user site, or any name (e.g. `portfolio`) for a project site.
2. In this folder run:
```
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/mhasancse15/<repo-name>.git
git push -u origin main
```
3. On GitHub: Settings > Pages > Source: **GitHub Actions**.
4. The push triggers the workflow in Actions. When it turns green, the site is live.

## URLs
- User site (repo `mhasancse15.github.io`): `https://mhasancse15.github.io/`
- Project site (repo `<repo-name>`): `https://mhasancse15.github.io/<repo-name>/`

The Vite `base` is `./`, so asset and CV paths work for both. To update the CV, replace the PDF in `public/` keeping the same filename.

## If the site does not work
1. **Actions tab is empty:** the `.github` folder was not uploaded (it is hidden on macOS/Windows and often skipped by drag-and-drop). Push with git instead, or check `.github/workflows/deploy.yml` exists in the repo on GitHub.
2. **Workflow is red:** open the failed run and read the first red step. `package.json` must be at the repository root, not inside a `portfolio/` subfolder.
3. **Deploy step says "Not Found" / Pages not enabled:** Settings > Pages > Source must be **GitHub Actions**. Free accounts need a **public** repository.
4. **Site shows the README or a 404:** the workflow has not finished yet, or Pages is still set to "Deploy from a branch".
5. **Blank page:** open the browser console (F12) and check for failed `assets/` requests.
6. Run `npm run typecheck` locally to see TypeScript issues (the deploy build no longer fails on them).
