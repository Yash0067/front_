# Deploy Backend to Railway - Step by Step

## Prerequisites
- GitHub account (you have this)
- Railway account (free, takes 2 min to create)

## Steps

### 1. Create Railway Account
1. Go to https://railway.app
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Railway
5. Done!

### 2. Create New Project
1. Click "New Project" on Railway dashboard
2. Select "Deploy from GitHub repo"
3. Click "Configure GitHub App"
4. Select your GitHub user
5. Select only the `backend_` repository
6. Click "Install and Authorize"

### 3. Select Repository
1. Back on Railway, click "backend_" from the list
2. Click "Deploy now"
3. Wait ~30 seconds for auto-detection

### 4. Add Environment Variables
1. Click your deployment in Railway
2. Go to "Variables" tab
3. Add these variables:

```
MONGODB_URI = mongodb+srv://notion_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/notion-clone?retryWrites=true&w=majority
JWT_SECRET = your-super-secret-key-change-this
NODE_ENV = production
PORT = 5000
```

For MONGODB_URI:
- If you don't have MongoDB Atlas yet, go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Create database user (username: notion_user, create password)
- Copy connection string
- Replace `<password>` with your actual password
- Replace `<cluster>` with your cluster name

4. Click "Update variables"

### 5. Get Your URL
1. Go to "Settings" tab in Railway
2. Look for "Domain" section
3. You'll see a URL like: `https://backend-production-xxxx.railway.app`
4. **Copy this URL - you'll need it for Vercel!**

### 6. Test It's Working
```
curl https://your-railway-url/
# Should see: "Flux API is running"
```

## Done! 🎉

Your backend is now live. The Railway URL is what you'll use in Vercel.

## Troubleshooting

**Deployment failed?**
- Click "View Logs" in Railway
- Look for error messages
- Common issues:
  - MONGODB_URI missing or invalid
  - PORT already in use
  - Node version mismatch

**Connection timeout?**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for now)
- Verify MONGODB_URI in Railway matches your cluster

**Need to update code?**
- Just push to GitHub
- Railway auto-redeploys on every push
