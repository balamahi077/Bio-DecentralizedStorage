# 🚀 Deployment Guide

This guide covers deploying the Bio-DecentralizedStorage application to various platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ Smart contract is deployed to Sepolia (or your target network)
- ✅ Contract address is updated in `web/src/contract.ts`
- ✅ You have a Pinata JWT token
- ✅ Code is pushed to GitHub
- ✅ All dependencies are installed and app builds successfully

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Best for:** Quick deployment, automatic CI/CD, serverless functions

#### Via GitHub (Easiest)

1. **Push to GitHub** (Already done! ✅)

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

3. **Import Project**
   - Click "Add New Project"
   - Select `balamahi077/Bio-DecentralizedStorage`

4. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: web
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_PINATA_JWT` = `your_pinata_jwt_token`

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

7. **Access Your App**
   - Your app will be live at: `https://your-project.vercel.app`
   - Vercel provides automatic HTTPS

#### Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to web directory
cd web

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? bio-decentralized-storage
# - Directory? ./
# - Override settings? No
```

#### Add Environment Variables (CLI)

```bash
# Add Pinata JWT
vercel env add VITE_PINATA_JWT

# When prompted, paste your JWT token
# Select: Production, Preview, Development
```

---

### Option 2: Netlify

**Best for:** Easy deployment, form handling, split testing

#### Via Netlify Dashboard

1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select `balamahi077/Bio-DecentralizedStorage`

3. **Configure Build Settings**
   ```
   Base directory: web
   Build command: npm run build
   Publish directory: web/dist
   ```

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_PINATA_JWT` = `your_pinata_jwt_token`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

6. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain or use: `your-site.netlify.app`

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to web directory
cd web

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow prompts:
# - Create & configure a new site? Yes
# - Team? Your team
# - Site name? bio-decentralized-storage
# - Build command? npm run build
# - Directory to deploy? dist
# - Netlify functions folder? (leave empty)

# Add environment variable
netlify env:set VITE_PINATA_JWT "your_jwt_token"

# Deploy to production
netlify deploy --prod
```

---

### Option 3: GitHub Pages

**Best for:** Free hosting, simple static sites

#### Setup Steps

1. **Update `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Bio-DecentralizedStorage/',  // Add this line
  plugins: [tailwindcss()],
})
```

2. **Install gh-pages**

```bash
cd web
npm install -D gh-pages
```

3. **Update `package.json`**

Add deploy script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **Deploy**

```bash
npm run deploy
```

5. **Configure GitHub Pages**
   - Go to repository settings on GitHub
   - Navigate to "Pages" section
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/ (root)`
   - Click "Save"

6. **Access Your App**
   - URL: `https://balamahi077.github.io/Bio-DecentralizedStorage/`
   - May take a few minutes to go live

**⚠️ Note:** GitHub Pages doesn't support environment variables. You'll need to set `PINATA_JWT` via browser console:
```javascript
window.PINATA_JWT = 'your_jwt_token'
```

---

### Option 4: Fleek (IPFS Hosting)

**Best for:** Fully decentralized hosting, Web3 apps

#### Setup Steps

1. **Go to Fleek**
   - Visit [fleek.co](https://fleek.co)
   - Sign up with GitHub

2. **Add New Site**
   - Click "Add new site"
   - Connect GitHub repository

3. **Configure Build**
   ```
   Framework: Vite
   Build command: npm run build
   Publish directory: dist
   Base directory: web
   Docker image: Node 18
   ```

4. **Environment Variables**
   - Add `VITE_PINATA_JWT` in settings

5. **Deploy**
   - Click "Deploy site"
   - Your site will be hosted on IPFS!

6. **Access**
   - IPFS URL: `ipfs://your-hash`
   - HTTP Gateway: `https://your-site.on.fleek.co`
   - ENS Domain (optional): Configure custom ENS

---

### Option 5: Render

**Best for:** Full-stack apps, databases, background workers

#### Setup Steps

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **New Static Site**
   - Click "New +" → "Static Site"
   - Connect repository

3. **Configure**
   ```
   Name: bio-decentralized-storage
   Root Directory: web
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Environment Variables**
   - Add `VITE_PINATA_JWT`

5. **Deploy**
   - Click "Create Static Site"

---

## 🔧 Post-Deployment Configuration

### Update Contract Address

If you deploy a new contract, update `web/src/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xYOUR_NEW_CONTRACT_ADDRESS'
```

Then redeploy:
- **Vercel/Netlify**: Push to GitHub (auto-deploys)
- **GitHub Pages**: Run `npm run deploy`
- **Fleek**: Push to GitHub (auto-deploys)

### Environment Variables

All platforms need:
```
VITE_PINATA_JWT=your_pinata_jwt_token
```

**Security Note:** Never commit `.env` files to Git!

### Custom Domain

Most platforms support custom domains:

1. **Vercel**: Settings → Domains → Add
2. **Netlify**: Domain settings → Add custom domain
3. **GitHub Pages**: Settings → Pages → Custom domain
4. **Fleek**: Settings → Domain → Add custom domain

---

## 🧪 Testing Deployment

After deployment, test:

1. ✅ Landing page loads correctly
2. ✅ "Get Started" button navigates to app
3. ✅ MetaMask connection works
4. ✅ File upload to IPFS works
5. ✅ Blockchain transactions work
6. ✅ File list displays correctly
7. ✅ Delete functionality works
8. ✅ Responsive design on mobile

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel & Netlify:**
- Automatically deploy on every push to `main` branch
- Preview deployments for pull requests

**GitHub Pages:**
- Run `npm run deploy` manually
- Or set up GitHub Actions for auto-deploy

**Fleek:**
- Auto-deploys on push to `main`

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd web
        npm install
    
    - name: Build
      run: |
        cd web
        npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./web/dist
```

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** TypeScript errors
```bash
# Fix: Check for type errors
cd web
npm run build
```

**Issue:** Missing dependencies
```bash
# Fix: Clean install
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Working

**Vercel/Netlify:**
- Ensure variable name starts with `VITE_`
- Redeploy after adding variables

**GitHub Pages:**
- Use browser console to set variables
- Consider using a backend service

### 404 on Refresh

**GitHub Pages:**
- Add `404.html` that redirects to `index.html`
- Or use hash routing instead of history mode

### CORS Errors

- Check Pinata API settings
- Ensure contract is deployed to correct network
- Verify MetaMask is connected to Sepolia

---

## 📊 Comparison Table

| Platform | Cost | IPFS | Custom Domain | Auto Deploy | Serverless |
|----------|------|------|---------------|-------------|------------|
| Vercel | Free tier | No | ✅ | ✅ | ✅ |
| Netlify | Free tier | No | ✅ | ✅ | ✅ |
| GitHub Pages | Free | No | ✅ | Manual | ❌ |
| Fleek | Free | ✅ | ✅ | ✅ | ❌ |
| Render | Free tier | No | ✅ | ✅ | ✅ |

---

## 🎯 Recommended Choice

**For this project, I recommend Vercel because:**

1. ✅ Free tier is generous
2. ✅ Automatic deployments from GitHub
3. ✅ Built-in environment variables
4. ✅ Excellent performance
5. ✅ Easy to add serverless functions later (for Pinata JWT)
6. ✅ Automatic HTTPS
7. ✅ Great developer experience

---

## 📞 Support

If you encounter issues:
1. Check platform-specific documentation
2. Review build logs
3. Test locally first: `npm run build && npm run preview`
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**
