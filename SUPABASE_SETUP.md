# Supabase Setup Guide

## Current Configuration

Your Supabase project is already configured with the following settings:

- **Project URL**: `https://narnndzvmpbqbuyoulvv.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcm5uZHp2bXBicWJ1eW91bHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDMyODIsImV4cCI6MjA2Nzg3OTI4Mn0.2BeFws0XDdCdp9yaPbbF3heDc7nVeUAzrpI5kHhpIIg`

## Testing the Connection

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit the debug page**: Go to `http://localhost:5173/debug`

3. **Test the connections**:
   - Click "Test Database Connection" to verify database access
   - Click "Test Auth Connection" to verify authentication

4. **Check the browser console** for detailed logs

## Common Issues and Solutions

### 1. Database Connection Failed
**Symptoms**: "Test Database Connection" fails
**Possible Causes**:
- Supabase project is paused (free tier)
- Network connectivity issues
- Incorrect project URL or key

**Solutions**:
- Check if your Supabase project is active in the dashboard
- Verify the URL and key in `src/integrations/supabase/client.ts`
- Try accessing the Supabase dashboard directly

### 2. Authentication Issues
**Symptoms**: Can't sign up or sign in
**Possible Causes**:
- Email confirmation required but not handled
- Password too short (minimum 6 characters)
- Username already exists
- Database trigger not working

**Solutions**:
- Use a password with at least 6 characters
- Try a different username
- Check if email confirmation is required
- Use the debug page to see detailed error messages

### 3. Profile Not Loading
**Symptoms**: User authenticated but profile is null
**Possible Causes**:
- Database trigger failed to create profile
- RLS (Row Level Security) policies blocking access
- Network issues

**Solutions**:
- Check the browser console for trigger errors
- Verify RLS policies in Supabase dashboard
- Try refreshing the page

## Debugging Steps

1. **Open browser console** (F12) and look for:
   - `🔍 Testing Supabase connection...`
   - `✅ Supabase connection test successful`
   - `❌ Supabase connection test failed`

2. **Check Supabase Dashboard**:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Check Auth → Users for user accounts
   - Check Database → Table Editor → profiles for profile data
   - Check Database → Logs for error messages

3. **Test with a simple signup**:
   - Use a simple email like `test@example.com`
   - Use a simple username like `testuser`
   - Use a password with at least 6 characters

## Environment Variables (Optional)

If you want to use environment variables instead of hardcoded values, create a `.env` file:

```env
VITE_SUPABASE_URL=https://narnndzvmpbqbuyoulvv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcm5uZHp2bXBicWJ1eW91bHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDMyODIsImV4cCI6MjA2Nzg3OTI4Mn0.2BeFws0XDdCdp9yaPbbF3heDc7nVeUAzrpI5kHhpIIg
```

Then update `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://narnndzvmpbqbuyoulvv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcm5uZHp2bXBicWJ1eW91bHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDMyODIsImV4cCI6MjA2Nzg3OTI4Mn0.2BeFws0XDdCdp9yaPbbF3heDc7nVeUAzrpI5kHhpIIg";
```

## Getting Help

If you're still having issues:

1. Check the debug page at `/debug`
2. Look at the browser console for error messages
3. Check the Supabase dashboard for logs
4. Try the connection tests on the debug page
5. Share any specific error messages you see 