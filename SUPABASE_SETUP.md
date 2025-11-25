# Supabase Database Setup Guide

## What You Need to Provide

Since you've already created the Supabase connection in Vercel, I need the following:

### 1. Database Connection String (DATABASE_URL)
This should be in your Vercel environment variables. It looks like:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1
```

**Where to find it:**
- Go to your Supabase project dashboard
- Settings → Database
- Look for "Connection string" or "Connection pooling"
- Copy the URI format connection string

### 2. Direct Connection String (for migrations)
We'll also need a direct connection (non-pooled) for running migrations:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

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

