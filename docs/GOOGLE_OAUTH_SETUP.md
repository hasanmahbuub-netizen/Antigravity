# Google OAuth Setup Instructions

## Step 1: Configure Google OAuth in Supabase

1. **Go to your Supabase Dashboard**
   - Navigate to: https://app.supabase.com/project/YOUR_PROJECT/auth/providers
   - Find "Google" in the list of providers

2. **Enable Google Provider**
   - Toggle the "Google Enabled" switch to ON

3. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to: **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - Application type: **Web application**
   - Name: `MEEK Auth` (or any name you prefer)

4. **Configure Authorized Redirect URIs**
   - Add this exact URL (replace YOUR_PROJECT_REF with your Supabase project reference):
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   - Example: `https://abcdefghijklmno.supabase.co/auth/v1/callback`

5. **Copy Credentials to Supabase**
   - Copy the **Client ID** from Google Cloud Console
   - Copy the **Client Secret** from Google Cloud Console
   - Paste both into the Supabase Google provider configuration
   - Click **Save**

## Step 2: Apply Database Migration

Run this SQL in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor → New query
# Copy and paste the contents of:
```

[04_auth_profile_triggers.sql](file:///c:/Users/HP/Downloads/OS/supabase/migrations/04_auth_profile_triggers.sql)

Or use the Supabase CLI:
```bash
supabase db push
```

## Step 3: Test the Flow

### Test Google Sign-Up (New User)
1. Go to `/auth/signup`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. You should land on `/onboarding`
5. Complete the 3 onboarding steps
6. You should land on `/dashboard`

### Test Email Sign-Up (New User)
1. Go to `/auth/signup`
2. Scroll to "OR REGISTER WITH EMAIL"
3. Fill in name, email, password
4. Check your email for confirmation link
5. After confirmation, sign in at `/auth/signin`
6. You should be redirected to `/onboarding`
7. Complete onboarding → land on `/dashboard`

### Test Existing User
1. Sign in with existing credentials
2. Should land directly on `/dashboard` (no onboarding redirect)

## Troubleshooting

### "Invalid redirect URI" error
- Double-check that the redirect URI in Google Cloud Console exactly matches your Supabase callback URL
- Ensure there are no trailing slashes

### Users not being created in `profiles` table
- Verify the trigger was created successfully:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- Check Supabase logs for any errors

### Stuck in onboarding loop
- Check if `onboarding_completed` is being set to `true`:
  ```sql
  SELECT id, email, onboarding_completed FROM profiles;
  ```
