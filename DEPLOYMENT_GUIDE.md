# Deployment Guide for Flux Application

## Overview
This guide covers deploying both the frontend (Next.js) and backend (Node.js) of the Flux application to various platforms.

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended for Next.js)

**Vercel** is the official platform for Next.js and provides seamless deployment.

#### Steps:

1. **Create a Vercel Account**
   - Go to https://vercel.com
   - Sign up or log in with GitHub

2. **Connect Your Repository**
   - Import your GitHub repository
   - Select the `frontend` directory as the root
   - Or use: https://github.com/Yash0067/front_.git

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Your app will be live at: `your-project.vercel.app`

#### Command Line Alternative:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod
```

---

### Option 2: Deploy to Netlify

**Netlify** is another excellent option for static/JAMstack sites.

#### Steps:

1. **Create a Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Connect Repository**
   - New site from Git
   - Choose your repository
   - Set build directory to `frontend`

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: frontend/.next
   Node version: 18.x
   ```

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

5. **Deploy**
   - Push to main branch
   - Netlify auto-deploys

---

### Option 3: Deploy to Railway

**Railway** is great for full-stack applications.

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - New project → GitHub Repo
   - Select your repository

3. **Configure Build**
   ```
   Build command: npm run build --prefix frontend
   Start command: npm run start --prefix frontend
   Root directory: frontend
   ```

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway auto-deploys on push

---

## Backend Deployment

### Option 1: Deploy to Railway (Recommended)

**Railway** makes backend deployment simple.

#### Steps:

1. **Create Railway Account** (if not already done)
   - https://railway.app

2. **Create New Service**
   - New project → GitHub Repo
   - Select your repository

3. **Configure Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notion-clone
   NODE_ENV=production
   JWT_SECRET=your-secure-secret-key
   ```

4. **Configure Build**
   ```
   Build command: npm install --prefix backend
   Start command: npm start --prefix backend
   Root directory: backend
   ```

5. **Deploy**
   - Railway handles deployment automatically

---

### Option 2: Deploy to Render

**Render** is another solid choice for Node.js apps.

#### Steps:

1. **Create Render Account**
   - https://render.com
   - Sign up with GitHub

2. **Create New Service**
   - New Web Service
   - Connect GitHub repository

3. **Configure**
   ```
   Build command: npm install --prefix backend
   Start command: npm start --prefix backend
   Root directory: backend
   ```

4. **Set Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   NODE_ENV=production
   JWT_SECRET=your-secret
   ```

5. **Deploy**
   - Click Deploy
   - Gets a URL like: `your-app.onrender.com`

---

### Option 3: Deploy to Heroku

**Heroku** is still popular for backend services.

#### Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku Account**
   - https://heroku.com

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create App**
   ```bash
   heroku create your-app-name
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   ```

6. **Create Procfile** (in backend directory)
   ```
   web: node src/server.js
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Account**
   - https://www.mongodb.com/cloud/atlas
   - Sign up or log in

2. **Create Cluster**
   - Build a database
   - Choose free tier
   - Select region

3. **Create Database User**
   - Add user with username and password
   - Grant admin access

4. **Get Connection String**
   - Connection → Connect your application
   - Copy connection string
   - Replace `<username>`, `<password>`, `<database>`

5. **Use in .env**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notion-clone
   ```

---

## Full Stack Deployment Example

### Using Railway (All-in-One)

1. **Create Railway Account**

2. **Create Variables**
   ```
   Frontend Environment:
   - NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

   Backend Environment:
   - MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/notion-clone
   - JWT_SECRET=your-strong-secret
   - CORS_ORIGIN=https://your-frontend.railway.app
   ```

3. **Deploy Both**
   ```bash
   # Frontend deploys to: your-frontend.up.railway.app
   # Backend deploys to: your-backend.up.railway.app
   ```

4. **Configure CORS in Backend**
   ```javascript
   // src/server.js
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
     credentials: true
   }));
   ```

---

## Post-Deployment Checklist

### Frontend
- [ ] Site loads without errors
- [ ] Authentication redirects work
- [ ] API calls reach backend
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Images load correctly
- [ ] Forms submit data

### Backend
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Authentication tokens valid
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] Logs accessible
- [ ] Error handling works

### General
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Logging enabled
- [ ] Performance acceptable

---

## Troubleshooting

### Frontend Issues

**Build fails**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Environment variables not working**
- Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side
- Check deployment platform's env var settings
- Redeploy after changing vars

**API calls failing**
- Verify backend URL in `NEXT_PUBLIC_API_URL`
- Check CORS settings on backend
- Review network tab in browser dev tools

### Backend Issues

**MongoDB connection fails**
- Verify connection string format
- Check database username/password
- Ensure IP whitelist includes server IP
- Test connection string locally

**Port conflicts**
- Use dynamic port: `const port = process.env.PORT || 5000`
- Check if port is already in use

**Environment variables not loading**
- Ensure `.env` file is in root of backend folder
- Don't commit `.env` to GitHub
- Set variables in deployment platform

---

## CI/CD Pipeline

Create automated deployments with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install --prefix frontend
          npm install --prefix backend
      
      - name: Build frontend
        run: npm run build --prefix frontend
      
      - name: Deploy frontend
        run: |
          # Add your deployment command
          echo "Deploying frontend..."
      
      - name: Deploy backend
        run: |
          # Add your deployment command
          echo "Deploying backend..."
```

---

## Monitoring & Logs

### Vercel
- Dashboard → Deployments → Logs
- Real-time logs for each deployment

### Railway
- Dashboard → Logs
- View both frontend and backend logs

### Render
- Service → Logs
- Stream logs in real-time

### Heroku
```bash
heroku logs --tail
```

---

## Performance Optimization

### Frontend
- Enable image optimization
- Use CDN for static assets
- Enable compression
- Minimize JavaScript bundles

### Backend
- Add caching headers
- Optimize database queries
- Use pagination for lists
- Enable gzip compression

---

## Support & Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)

---

## Cost Estimates (Approximate)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | 100GB bandwidth/month |
| Railway | $5-50/month | Per service usage-based |
| Netlify | Free-$45/month | Free has basic features |
| Render | $7-50/month | Per service |
| MongoDB Atlas | Free-$9/month | 512MB free tier |
| Total | $12-149/month | Varies by scale |

---

## Next Steps

1. Choose your deployment platform
2. Create accounts on chosen services
3. Follow the deployment steps for your choice
4. Test all features in production
5. Set up monitoring and logging
6. Configure backups
7. Document your deployment process

Good luck with your deployment! 🚀
