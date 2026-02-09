# Deployment Guide - Vercel

This guide will help you deploy your Readynx application to Vercel.

## Prerequisites

- A GitHub account (already done ✅)
- A Vercel account (sign up at https://vercel.com)
- Your code pushed to GitHub (already done ✅)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Find and select `binary-hackathon-frontend` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your site will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? binary-hackathon-frontend (or your choice)
# - Directory? ./ (press Enter)
# - Override settings? No

# For production deployment
vercel --prod
```

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables (If Needed)

1. Go to "Settings" → "Environment Variables"
2. Add any required variables
3. Redeploy for changes to take effect

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`

### 404 Errors on Routes

- The `vercel.json` file handles SPA routing
- Ensure it's committed to your repository

### Slow Build Times

- Vercel caches dependencies automatically
- First build may take longer

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove a deployment
vercel rm [deployment-name]

# Open project in browser
vercel open
```

## Your Project URLs

After deployment, you'll get:
- **Production**: `https://binary-hackathon-frontend.vercel.app`
- **Preview**: Unique URL for each branch/PR

## Support

- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
- Community: https://github.com/vercel/vercel/discussions

---

**Note**: Your project is already configured with `vercel.json` for optimal deployment settings.
