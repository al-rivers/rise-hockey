# Rise Hockey — GitHub Pages Deployment Guide

## Why GitHub Pages over Netlify

| Feature | GitHub Pages | Netlify Free |
|---------|-------------|--------------|
| Bandwidth | Unlimited (soft 100GB/month) | 100GB/month hard limit |
| Builds | Unlimited | 300 minutes/month |
| Custom domain | Free | Free |
| HTTPS | Automatic | Automatic |
| Credit card | Never required | Required for overages |
| Cost | Always free | Free with limits |

GitHub Pages is run by Microsoft/GitHub and has been free for public repositories
since 2008. It will not charge you. Ever. For a personal app like Rise Hockey
it is the ideal permanent home.

---

## Step-by-Step Deployment

### Step 1 — Create a GitHub Account (if needed)
Go to github.com and create a free account.

### Step 2 — Create a New Repository
1. Click the + icon → "New repository"
2. Name it: `rise-hockey`
3. Set visibility to: **Public** (required for free GitHub Pages)
4. Click "Create repository"

### Step 3 — Upload the Files
1. Click "uploading an existing file" on the repository page
2. Drag all files from this folder into the upload area:
   - index.html
   - service-worker.js
   - manifest.json
   - icon-192.png
   - icon-512.png
   - apple-touch-icon.png
   - favicon-32.png
3. Click "Commit changes"

### Step 4 — Enable GitHub Pages
1. Go to repository Settings (gear icon)
2. Scroll to "Pages" in the left sidebar
3. Under "Branch" select: **main**
4. Under "folder" select: **/ (root)**
5. Click Save

### Step 5 — Get Your URL
GitHub will give you a URL like:
`https://yourusername.github.io/rise-hockey/`

This is your permanent free HTTPS URL.

---

## Fix the Service Worker Scope for GitHub Pages

GitHub Pages serves files from a subfolder path (`/rise-hockey/`) not the root (`/`).
This requires one change to the manifest.json start_url.

Update manifest.json:
- Change `"start_url": "/"` to `"start_url": "/rise-hockey/"`
- Change `"scope": "/"` to `"scope": "/rise-hockey/"`
- Change `"id": "/"` to `"id": "/rise-hockey/"`

And in index.html, update the SW registration path:
- Change `/service-worker.js` to `./service-worker.js`
- Change `href="/manifest.json"` to `href="./manifest.json"`

The `github-pages` versions of these files provided in this folder
already have these corrections applied.

---

## Updating the App

When you have new files to deploy:
1. Go to your GitHub repository
2. Click the file you want to replace
3. Click the pencil icon (Edit)
4. Or drag new files to the repository

Changes go live within 1-2 minutes.

---

## Alternative: Cloudflare Pages

If you prefer Cloudflare Pages (also unlimited free):
1. Go to pages.cloudflare.com
2. Click "Create a project" → "Direct Upload"
3. Drag your folder
4. Done — you get a `*.pages.dev` URL

Cloudflare serves from 300+ global edge locations so it is faster
than GitHub Pages for international users. Both work equally well for
a personal app used in Nova Scotia.

---

*Rise Hockey — Built for Aleks Kikuchi's D1 journey*
