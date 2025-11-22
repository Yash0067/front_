# MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Create an account with your email
4. Verify your email

### Step 2: Create a Cluster
1. After login, click "Create" button
2. Select "M0 Free" tier (free forever)
3. Select region: "AWS" → "us-east-1" (closest to you, or your preferred region)
4. Click "Create Deployment"
5. Wait 5-10 minutes for cluster creation

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `notion_user` (or your choice)
5. Password: Create a strong password (save it!)
6. Database User Privileges: "Built-in Role" → "readWriteAnyDatabase"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
   - Add `0.0.0.0/0` to allow all IPs
4. Click "Confirm"

⚠️ **Note:** For production, use specific IP addresses instead of allowing all

### Step 5: Get Connection String
1. Go back to "Database" (Clusters section)
2. Click "Connect" button on your cluster
3. Select "Drivers" (not Compass)
4. Copy the connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials

### Step 6: Update Your .env File
Replace your current `MONGODB_URI` in `.env`:

**Before:**
```
MONGODB_URI=mongodb://127.0.0.1:27017/notion-clone
```

**After:**
```
MONGODB_URI=mongodb+srv://notion_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/notion-clone?retryWrites=true&w=majority
```

Example:
```
MONGODB_URI=mongodb+srv://notion_user:MySecurePassword123@cluster0.abc123.mongodb.net/notion-clone?retryWrites=true&w=majority
```

### Step 7: Test Connection
1. Save the `.env` file
2. Restart your backend server:
   ```bash
   npm start
   ```
3. You should see: `Connected to MongoDB`

## Troubleshooting

### Connection Error: "authentication failed"
- Check username and password in connection string
- Verify database user exists in "Database Access"

### Connection Error: "connection timeout"
- Go to "Network Access"
- Make sure your IP is whitelisted
- Try "Allow Access from Anywhere" for testing

### Connection Error: "Invalid host"
- Copy the full connection string from MongoDB Atlas
- Make sure you replaced `<username>` and `<password>`
- Database name in URL should match your .env (notion-clone)

## Important Security Notes

⚠️ **Never commit .env files to GitHub!**
- Your `.env` file is already in `.gitignore`
- For production, use MongoDB Atlas IP whitelist with specific IPs
- Consider using environment variables in your deployment platform (Vercel, Railway, etc.)

## Optional: Local MongoDB Setup (If Preferred)

If you want to use local MongoDB instead:

1. Download MongoDB Community Edition: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install it on your computer
3. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # Mac/Linux
   brew services start mongodb-community
   ```
4. Keep your original `.env`:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/notion-clone
   ```

## What's Next?

After MongoDB Atlas is connected:
1. Your backend will start successfully
2. Data will be stored in the cloud
3. You can access your data from MongoDB Atlas dashboard
4. When deploying to production (Vercel, Railway), add the same connection string to environment variables
