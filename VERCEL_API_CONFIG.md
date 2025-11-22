# Vercel Deployment - API Configuration Guide

## Problem: ERR_TOO_MANY_REDIRECTS

This error occurs because your frontend on Vercel is trying to connect to `http://localhost:5000` which doesn't exist in production.

## Solution: Set API URL on Vercel

### Step 1: Deploy Your Backend First

Your frontend needs a running backend API. Choose one:

**Option A: Railway (Recommended)**
1. Go to https://railway.app
2. Connect your GitHub `backend_` repository
3. Add environment variables from your `.env` file:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret
   - `NODE_ENV`: production
4. Deploy and note the URL (e.g., `https://your-app-backend.railway.app`)

**Option B: Render**
1. Go to https://render.com
2. Connect your GitHub backend repository
3. Create new Web Service
4. Set environment variables (same as above)
5. Deploy and note the URL

**Option C: Heroku**
1. Go to https://heroku.com
2. Connect GitHub repository
3. Set environment variables
4. Deploy and copy the URL

### Step 2: Configure Vercel with Backend URL

#### Method 1: Vercel Dashboard (Easy)
1. Go to https://vercel.com/dashboard
2. Select your `front_` project
3. Click "Settings" → "Environment Variables"
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-app-backend.railway.app`)
   - **Environments**: Select "Production"
5. Click "Save"
6. Go to "Deployments" and click "Redeploy" on your latest deployment

#### Method 2: Command Line
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter your backend URL when prompted
vercel --prod
```

### Step 3: Test the Connection

After redeploying, test:
1. Open your Vercel app URL
2. Try to sign up or log in
3. Check browser console (F12) for any API errors
4. If connection works, you should see data loading

## API URL Examples

| Environment | URL |
|------------|-----|
| Local Development | `http://localhost:5000` |
| Railway | `https://your-app-xyz.railway.app` |
| Render | `https://your-app.onrender.com` |
| Heroku | `https://your-app.herokuapp.com` |

## Troubleshooting

### Still getting ERR_TOO_MANY_REDIRECTS?

1. **Clear Vercel cache:**
   - Go to Settings → Git
   - Scroll to "Deployments" and click "Clear All Cache"
   - Redeploy

2. **Check environment variable:**
   - Go to Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Make sure there are no trailing slashes

3. **Test backend connectivity:**
   ```bash
   curl https://your-backend-url/api/auth/login
   # Should return 400 or 422 (expects POST with data)
   # NOT redirect or connection error
   ```

4. **Check backend CORS:**
   Your backend should allow requests from your Vercel domain
   - Add to backend CORS: `https://your-app.vercel.app`

### API calls still failing?

1. Check browser Network tab (F12 → Network)
2. Look for failed requests to your backend
3. Check the error response:
   - 404: API endpoint doesn't exist
   - 500: Backend server error
   - CORS error: Backend CORS needs updating

## MongoDB Configuration

Make sure your backend has MongoDB configured:

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to your backend deployment:
   - Set environment variable: `MONGODB_URI=mongodb+srv://...`
   - Verify database user credentials
   - Whitelist IP address (allow all for testing: 0.0.0.0/0)

## Next Steps

1. ✅ Deploy backend to Railway/Render/Heroku
2. ✅ Set `NEXT_PUBLIC_API_URL` in Vercel
3. ✅ Redeploy frontend on Vercel
4. ✅ Test authentication (signup/login)
5. ✅ Create test data (projects, pages, tasks)
6. ✅ Monitor for errors

## Security Notes

- `NEXT_PUBLIC_` variables are exposed to client - this is safe for API URLs
- Never expose secrets like API keys or JWT_SECRET in public variables
- Keep JWT_SECRET only in backend environment
- Use MongoDB Atlas IP whitelist for production
- Consider API rate limiting on backend
