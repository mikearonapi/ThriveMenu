# Supabase Database Setup Guide

## ✅ Setup Complete - Ready for Your DATABASE_URL!

I've already set up everything needed for Supabase connection. Here's what's been done:

### ✅ Completed Setup:
1. ✅ Added Prisma and @prisma/client to dependencies
2. ✅ Created Prisma Client singleton (`src/lib/db.ts`)
3. ✅ Updated all API routes to use Prisma:
   - `/api/favorites` - Now uses database
   - `/api/recipes/[id]/ratings` - Now uses database
   - `/api/auth/register` - Now uses database
   - `/api/auth/login` - Now uses database (via NextAuth)
4. ✅ Updated NextAuth to use Prisma adapter
5. ✅ Updated Prisma schema to support Supabase connection pooling

### 🔑 What You Need to Do:

**Just add your DATABASE_URL to Vercel environment variables:**

1. Go to your Vercel project → Settings → Environment Variables
2. Add these two variables:

   **DATABASE_URL** (Connection Pooling - for app):
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1
   ```
   
   **DIRECT_URL** (Direct Connection - for migrations):
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

   **Where to find these:**
   - Go to Supabase Dashboard → Settings → Database
   - **Connection Pooling** tab → Copy "Connection string" (URI) → This is DATABASE_URL
   - **Connection String** tab → Copy "URI" → This is DIRECT_URL

3. Also add (if not already there):
   ```
   NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

### 🚀 Next Steps After Adding DATABASE_URL:

Once you've added the environment variables to Vercel, I'll:
1. Run database migrations to create all tables
2. Seed the database with all 240+ recipes
3. Test the connection

**Just let me know when the DATABASE_URL is in Vercel and I'll run the migrations!**

## What I'll Set Up

Once you provide the DATABASE_URL, I will:

1. ✅ Add Prisma to dependencies (currently missing)
2. ✅ Create Prisma Client singleton for database access
3. ✅ Update all API routes to use Prisma instead of mock storage:
   - `/api/favorites` - User favorites
   - `/api/recipes/[id]/ratings` - Recipe ratings
   - `/api/recipes/[id]/reviews` - Recipe reviews
   - `/api/auth/register` - User registration
   - `/api/auth/login` - User authentication (via NextAuth)
4. ✅ Run database migrations to create all tables
5. ✅ Seed the database with all 240+ recipes
6. ✅ Update NextAuth to use Prisma adapter

## Environment Variables Needed

Add these to your Vercel project (Settings → Environment Variables):

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
NEXTAUTH_SECRET=[generate a random secret]
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Next Steps

1. **Get your DATABASE_URL from Supabase**
2. **Add it to Vercel environment variables**
3. **Share the connection string with me** (or just confirm it's in Vercel)
4. **I'll handle the rest!**

## Testing the Connection

After setup, we can test with:
```bash
npm run prisma:studio  # Visual database browser
npm run prisma:seed    # Seed recipes
```

