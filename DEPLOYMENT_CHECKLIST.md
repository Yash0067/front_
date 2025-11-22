# Quick Deployment Checklist

## Pre-Deployment

### Frontend
- [x] Build passes: `npm run build`
- [ ] All environment variables set
- [ ] API URL configured correctly
- [ ] No console errors
- [ ] Mobile responsive tested
- [ ] Dark mode tested
- [ ] All links working

### Backend
- [ ] All dependencies installed
- [ ] Database connection tested
- [ ] Environment variables configured
- [ ] API endpoints tested locally
- [ ] CORS configured
- [ ] Error handling implemented

---

## Recommended Deployment Option: Railway

**Why Railway?**
- ✅ Supports both frontend and backend
- ✅ Easy environment variable management
- ✅ Automatic deployments on git push
- ✅ Free to start ($5-7/month)
- ✅ Good documentation
- ✅ Real-time logs

---

## Railway Deployment Steps

### 1. Sign Up
- Go to https://railway.app
- Sign up with GitHub

### 2. Create Frontend Service
```bash
New Project → GitHub Repo → Select your repo
Root directory: frontend
Build command: npm run build
Start command: npm start
```

Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NODE_ENV=production
```

### 3. Create Backend Service
```bash
New Project → GitHub Repo → Select your repo
Root directory: backend
Build command: npm install
Start command: node src/server.js
```

Environment Variables:
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/notion-clone
NODE_ENV=production
JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=https://your-frontend-url
```

### 4. Get Your URLs
- Frontend: `your-project-web.up.railway.app`
- Backend: `your-project-api.up.railway.app`

### 5. Update Frontend Config
Update `NEXT_PUBLIC_API_URL` to point to your backend URL

---

## Alternative: Vercel + Railway

**Best for Next.js apps**

### Frontend on Vercel
1. Go to https://vercel.com
2. Import repository
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Backend on Railway
(Follow steps above)

---

## MongoDB Setup

### Using MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create Account
3. Create Cluster (Free Tier)
4. Create Database User
   - Username: your-username
   - Password: your-password

5. Get Connection String
   ```
   mongodb+srv://username:password@cluster.mongodb.net/notion-clone
   ```

6. Add your deployment IP to whitelist
   - Network Access → IP Whitelist → Add IP Address
   - For deployed apps: Add `0.0.0.0/0` (or specific IP)

---

## Environment Variables Template

### Frontend (.env.local or Vercel dashboard)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Backend (.env file - DO NOT COMMIT)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/notion-clone
JWT_SECRET=your-secure-random-secret-key-change-this
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## Health Check

After deployment, test these:

```bash
# Frontend
curl https://your-frontend-url

# Backend API
curl https://your-backend-url/api/health

# Test Auth
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

---

## Monitoring

### Set up error tracking
- [ ] Sentry for frontend errors
- [ ] Sentry for backend errors
- [ ] LogRocket for user sessions
- [ ] Datadog for performance

### Enable logging
- [ ] CloudFlare for CDN & logs
- [ ] Papertrail for centralized logs
- [ ] Loggly for log aggregation

---

## Performance

### Before Deployment
```bash
# Analyze bundle size
npm run build
du -sh frontend/.next

# Check lighthouse score
npm run build && npx lighthouse https://localhost:3000
```

### After Deployment
- [ ] Lighthouse score > 80
- [ ] Core Web Vitals green
- [ ] Load time < 2 seconds
- [ ] API response < 500ms

---

## Security Checklist

- [ ] API keys not in code
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] Password hashing (bcrypt) enabled

---

## Rollback Plan

If something goes wrong:

```bash
# Revert to previous version
git revert HEAD

# Or redeploy specific commit
git push origin commit-hash:main
```

### On Railway
- Go to Deployments
- Click "Deploy this commit"

### On Vercel
- Go to Deployments
- Click "Redeploy"

---

## After Deployment

1. [ ] Test all features in production
2. [ ] Check error logs
3. [ ] Verify API connectivity
4. [ ] Test authentication flow
5. [ ] Create test user account
6. [ ] Document deployment process
7. [ ] Set up monitoring alerts
8. [ ] Schedule regular backups
9. [ ] Plan scaling strategy

---

## Support

Need help?
- Check deployment logs
- Review error messages
- Test locally with same environment
- Check platform documentation
- Ask in GitHub Issues

---

## Quick Commands

```bash
# Build and test locally
npm run build --prefix frontend
npm start --prefix backend

# Check for errors
npm run lint --prefix frontend
npm run lint --prefix backend

# Update dependencies
npm update --prefix frontend
npm update --prefix backend

# Clean and rebuild
rm -rf frontend/.next backend/node_modules
npm install --prefix frontend
npm install --prefix backend
npm run build --prefix frontend
```

---

✅ You're ready to deploy! 🚀
