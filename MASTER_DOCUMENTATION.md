# MEEK - Complete Project Documentation
## Muslim Education & Empowerment Kit

*Last Updated: December 29, 2025*  
*Version: 1.0.0*

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Environment Variables & API Keys](#environment-variables--api-keys)
4. [Database Architecture](#database-architecture)
5. [Features Documentation](#features-documentation)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Authentication & Authorization](#authentication--authorization)
8. [Push Notification System](#push-notification-system)
9. [External Services](#external-services)
10. [Project Structure](#project-structure)
11. [Deployment Guide](#deployment-guide)
12. [Development Setup](#development-setup)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What is MEEK?
MEEK (Muslim Education & Empowerment Kit) is a comprehensive Islamic learning platform focused on Quran memorization and Fiqh (Islamic jurisprudence) education. The app provides AI-powered Tajweed analysis, madhab-specific Fiqh guidance, and personalized spiritual growth tracking.

### Core Objectives
- **Quran Practice**: Interactive verse-by-verse practice with AI feedback
- **Fiqh Q&A**: Madhab-specific Islamic jurisprudence answers
- **Progress Tracking**: Personal spiritual journey monitoring
- **Smart Reminders**: Prayer time and dua notifications

### Target Users
- Muslims seeking to improve Quran recitation
- Students of Islamic jurisprudence
- Anyone wanting to strengthen their Islamic practice

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 16.0.10 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Headless UI, Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (Deno)

### AI & ML
- **Speech Recognition**: OpenAI Whisper API
- **Text Analysis**: OpenAI GPT-4
- **Tajweed Analysis**: Custom algorithm + GPT-4
- **Fiqh Answers**: RAG (Retrieval Augmented Generation) with GPT-4

### External Services
- **Quran Data**: Al-Quran Cloud API
- **Prayer Times**: Aladhan API
- **Analytics**: (To be configured)

### DevOps
- **Hosting**: Vercel
- **Database Hosting**: Supabase Cloud
- **CI/CD**: Vercel Git Integration
- **Version Control**: Git

---

## 🔑 Environment Variables & API Keys

### Required Environment Variables

Create a `.env.local` file in the project root with the following:

```bash
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# ============================================
# OPENAI
# ============================================
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]

# ============================================
# PUSH NOTIFICATIONS (VAPID)
# ============================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=[YOUR_VAPID_PUBLIC_KEY]
VAPID_PRIVATE_KEY=[YOUR_VAPID_PRIVATE_KEY]
VAPID_SUBJECT=mailto:your-email@example.com

# ============================================
# EXTERNAL APIS
# ============================================
# Al-Quran Cloud - No key required (public API)
# Aladhan API - No key required (public API)

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How to Obtain API Keys

#### 1. Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Project Settings → API
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### 2. OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create new secret key
5. Copy to `OPENAI_API_KEY`

#### 3. VAPID Keys (Push Notifications)
Run this command in your project:
```bash
npx web-push generate-vapid-keys
```
This will output:
- Public Key → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Private Key → `VAPID_PRIVATE_KEY`

#### 4. Google OAuth (Optional but Recommended)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
6. Configure in Supabase Dashboard → Authentication → Providers → Google

---

## 🗄️ Database Architecture

### Schema Overview

The database consists of 11 main tables:

1. **profiles** - User profiles and preferences
2. **quran_surahs** - Surah metadata (114 surahs)
3. **quran_verses** - All Quran verses with translations
4. **quran_verse_progress** - User's Quran learning progress
5. **recitation_attempts** - AI feedback history
6. **fiqh_questions** - User's Fiqh Q&A history
7. **notification_subscriptions** - Push notification endpoints
8. **notification_settings** - User notification preferences
9. **notification_logs** - Sent notifications tracking

### Database Migrations

Located in `supabase/migrations/`:

#### 1. `database_schema.sql` (Initial Setup)
Core tables for user profiles, Quran data, progress tracking, and Fiqh questions.

**Key Tables:**
- `profiles`: User data with madhab, arabic_level, goals
- `quran_surahs`: 114 surahs with metadata
- `quran_verses`: All verses with Arabic, transliteration, English, Bangla
- `quran_verse_progress`: Tracks completed verses per user
- `recitation_attempts`: Stores AI feedback on recitations
- `fiqh_questions`: Q&A history with madhab context

#### 2. `02_push_notifications.sql`
Legacy table for push notifications (superseded by migration 03).

#### 3. `03_notifications.sql`
Complete push notification system:
- `notification_subscriptions`: Web Push subscriptions
- `notification_settings`: Prayer/dua reminder preferences
- `notification_logs`: Sent notifications audit trail

**Features:**
- Row Level Security (RLS) enabled
- User-specific policies
- Service role access for backend
- Timezone support
- Location tracking for prayer times

#### 4. `04_auth_profile_triggers.sql` ⭐ NEW
Automatic profile management:
- Adds `onboarding_completed` column to profiles
- Creates trigger for automatic profile creation on signup
- Supports both Email and Google OAuth signups
- Backfills existing users' onboarding status

**Key Function:**
```sql
CREATE FUNCTION public.handle_new_user()
-- Auto-creates profile when user signs up
-- Extracts data from auth.users metadata
```

### Applying Migrations

**Development (Supabase CLI):**
```bash
supabase db push
```

**Production (SQL Editor):**
1. Open Supabase Dashboard → SQL Editor
2. Copy migration file content
3. Run in order (database_schema → 03 → 04)

---

## ⚡ Features Documentation

### 1. Quran Practice System

**Location**: `/quran`

**Features**:
- Browse all 114 surahs
- Verse-by-verse practice interface
- Audio playback of correct recitation
- Record your own recitation
- AI-powered Tajweed analysis
- Progress tracking (green checkmarks for completed verses)
- Surah completion statistics

**Tech Stack**:
- Audio recording via Web Audio API
- Audio playback with HTML5 Audio
- OpenAI Whisper for speech-to-text
- GPT-4 for Tajweed feedback
- localStorage for offline progress caching

**API Endpoint**: `/api/quran/analyze`

**Data Flow**:
1. User records their recitation
2. Audio sent to `/api/quran/analyze`
3. Whisper transcribes Arabic text
4. GPT-4 compares with correct verse
5. Tajweed errors identified
6. Feedback returned to user
7. Progress saved to `recitation_attempts` table

---

### 2. Fiqh Q&A System

**Location**: `/fiqh`

**Features**:
- Ask Islamic jurisprudence questions
- Madhab-specific answers (Han afi, Shafi'i, Maliki, Hanbali)
- Source citations from classical texts
- Question history
- Copy answer functionality

**Tech Stack**:
- GPT-4 with custom Fiqh prompts
- Madhab-specific knowledge base
- RAG (Retrieval Augmented Generation)

**API Endpoint**: `/api/fiqh/ask`

**Data Flow**:
1. User submits question
2. System adds madhab context from user profile
3. GPT-4 generates answer with sources
4. Answer saved to `fiqh_questions` table
5. Response displayed with formatting

---

### 3. Authentication System ⭐ NEW

**Location**: `/auth/signin`, `/auth/signup`

**Features**:
- **Primary**: Google OAuth (one-click sign-in)
- **Secondary**: Email/Password
- Premium glassmorphism UI
- Automatic profile creation
- Onboarding flow for new users
- Session management via Supabase Auth

**Auth Flow**:

**Google OAuth**:
```
Click "Continue with Google"
  ↓
Redirect to Google consent screen
  ↓
User authorizes
  ↓
Callback to /auth/callback
  ↓
Supabase creates auth.users entry
  ↓
Trigger creates profiles entry
  ↓
Redirect to /onboarding (first time) or /dashboard
```

**Email/Password**:
```
Fill form → Submit
  ↓
Supabase sends confirmation email
  ↓
User clicks email link
  ↓
Email confirmed
  ↓
User can sign in
  ↓
Redirect to /onboarding (first time) or /dashboard
```

**Key Files**:
- `src/context/AuthContext.tsx`: Auth state management
- `src/app/auth/signin/page.tsx`: Sign-in UI
- `src/app/auth/signup/page.tsx`: Sign-up UI
- `src/app/auth/callback/route.ts`: OAuth callback handler
- `src/middleware.ts`: Route protection

---

### 4. Onboarding Flow ⭐ NEW

**Location**: `/onboarding`

**Features**:
- 3-step wizard (Madhab → Arabic Level → Language)
- Progress indicator
- Saves preferences to profile
- Redirects to dashboard on completion

**Steps**:
1. **Madhab Selection**: Hanafi, Shafi'i, Maliki, Hanbali
2. **Arabic Level**: Beginner, Intermediate, Advanced
3. **Language**: English, Bangla

**Data Saved**:
- `madhab` → Used for Fiqh answers
- `arabic_level` → Used for personalized learning
- `language` → UI language preference
- `onboarding_completed` → Flag to prevent re-showing

---

### 5. Push Notification System

**Architecture**: Device-Based (Client-Side Scheduling)

**Features**:
- Prayer start alerts (5 daily)
- Prayer ending warnings (20 min before next prayer)
- Dua reminders (4 daily: morning, midday, evening, night)
- User-controlled preferences
- Timezone-aware scheduling
- Fear-based motivational messages

**Tech Stack**:
- Service Worker (`public/sw.js`)
- Web Push API
- VAPID authentication
- Client-side scheduler (30-second intervals)

**Data Flow**:
```
User enables notifications in /settings
  ↓
Permission requested
  ↓
Push subscription created
  ↓
Subscription sent to /api/notifications/subscribe
  ↓
Settings saved to notification_settings table
  ↓
Dashboard fetches daily schedule from /api/notifications/get-daily/[userId]
  ↓
Client scheduler checks every 30s for pending notifications
  ↓
Service Worker displays notification
  ↓
User clicks → Deep link to relevant page
```

**Key Files**:
- `src/lib/notificationScheduler.ts`: Client-side scheduler
- `src/lib/calculateNotificationTimes.ts`: Prayer time calculator
- `src/lib/push-notifications.ts`: Message templates & registration
- `public/sw.js`: Service Worker
- `src/app/settings/page.tsx`: Notification preferences UI

**Cost**: Completely FREE (no server resources)

---

### 6. Dashboard

**Location**: `/dashboard`

**Features**:
- Personalized greeting (time-based)
- Current/next prayer info
- Spiritual nudges (dua reminders)
- Notification bell with dropdown
- Quick access to Quran practice
- Quick access to Fiqh Q&A
- Ambient orb (spiritual presence indicator)

**Layout**:
- **Zone A (60%)**: Quran Practice card
- **Zone B (40%)**: Fiqh Q&A card

**Onboarding Check**:
- On load, checks `onboarding_completed` status
- Redirects to `/onboarding` if false
- Ensures all new users complete profile setup

---

### 7. Settings Page

**Location**: `/settings`

**Features**:
- Profile settings (Madhab, Language, Daily Goals)
- Notification preferences (Master toggle, Prayer start, Prayer ending, Duas)
- Account management
- Sign-out functionality

**Notification Settings**:
- Master enable/disable toggle
- Individual toggles for:
  - Prayer start alerts
  - 20-minute warnings
  - Dua reminders
- Saves to `notification_settings` table
- Triggers push subscription registration

---

## 🔌 API Endpoints Reference

### Authentication
None - Handled by Supabase Auth SDK

### Quran
- **POST** `/api/quran/analyze`
  - Analyzes user's recitation
  - Body: `{ audio: base64, surah: number, ayah: number }`
  - Returns: `{ transcription, feedback, score }`

- **GET** `/api/sync/quran`
  - Syncs Quran data from Al-Quran Cloud
  - Admin only
  - Returns: Verse count synced

### Fiqh
- **POST** `/api/fiqh/ask`
  - Answers Fiqh questions
  - Body: `{ question: string, madhab: string }`
  - Returns: `{ answer, sources }`

### Notifications
- **POST** `/api/notifications/subscribe`
  - Saves push subscription
  - Body: `{ subscription: PushSubscription, userId: string }`
  - Returns: Success/error

- **GET** `/api/notifications/get-daily/[userId]`
  - Gets today's notification schedule
  - Params: `userId`
  - Returns: Array of `{ time, type, message }`

### Admin
- **POST** `/api/admin/setup-db`
  - Initializes database
  - Runs migrations
  - Admin only

- **GET** `/api/check-env`
  - Verifies environment variables
  - Development only

### Tajweed Analysis
- **POST** `/api/analyze-tajweed`
  - Detailed Tajweed error detection
  - Body: `{ transcription: string, correctText: string }`
  - Returns: `{ errors: [], score: number }`

---

## 🔐 Authentication & Authorization

### Authentication Methods

1. **Google OAuth** (Primary)
   - One-click sign-in
   - No password needed
   - Profile photo extracted
   - Email verified by Google

2. **Email/Password** (Secondary)
   - Email confirmation required
   - Min 6-character password
   - Password reset functionality

### Authorization Levels

1. **Public** - Landing page only
2. **Authenticated** - All app routes
3. **Admin** - Database setup, sync operations

### Middleware Protection

**File**: `src/middleware.ts`

**Protected Routes**:
- `/dashboard`
- `/quran`
- `/fiqh`
- `/settings`
- `/onboarding`

**Logic**:
- No auth session → Redirect to `/auth/signin`
- Has auth session on auth pages → Redirect to `/dashboard`

### Row Level Security (RLS)

All tables have RLS policies:

**Profiles**:
- Users can SELECT/UPDATE own profile
- Users can INSERT on first creation

**Quran Data**:
- Public READ access
- No write access (admin-only via API)

**Progress/Attempts**:
- Users can SELECT/INSERT own records
- No access to other users' data

**Notifications**:
- Users can SELECT/UPDATE/DELETE own subscriptions
- Service role can SELECT all for scheduling

---

## 📱 Push Notification System

### Architecture Decision

**Chosen Approach**: Device-Based Client-Side Scheduling

**Why**:
- ✅ Completely FREE (no server costs)
- ✅ No need for cron jobs
- ✅ No external services
- ✅ Works with free-tier hosting

**Trade-offs**:
- ⚠️ Notifications may be 30-60 seconds late
- ⚠️ Requires device to be online
- ⚠️ PWA installation recommended for reliability

### How It Works

1. **Permission Request**
   - User enables notifications in Settings
   - Browser requests notification permission
   - User grants access

2. **Subscription Creation**
   - Service Worker registers push subscription
   - VAPID public key used for authentication
   - Subscription saved to database

3. **Schedule Calculation**
   - On dashboard load, fetch daily schedule
   - API calculates 14 notifications:
     - 5 prayer start times (from Aladhan API)
     - 5 prayer ending times (20 min before next)
     - 4 dua times (7am, 1pm, 5pm, 9pm)
   - Filter based on user preferences

4. **Client-Side Polling**
   - Scheduler runs every 30 seconds
   - Checks if any notification time has passed
   - Shows notification via Service Worker
   - Marks as sent in localStorage

5. **Notification Display**
   - Fear-based motivational message
   - Relevant emoji
   - Deep link to /quran or /fiqh
   - Persistent until dismissed

### Message Templates

**Prayer Start**:
```
"🕌 Fajr has arrived! Don't delay - the angels are recording your actions."
"⏰ Dhur time! Will you stand before Allah or let it pass?"
"🌅 Asr is here. The day is ending - have you secured your place in Jannah?"
```

**Prayer Ending**:
```
"⏳ Only 20 minutes until Fajr ends! Don't risk losing this obligation!"
"⚠️ 20 minutes left for Dhur! Your accountability is near!"
```

**Dua Reminders**:
```
"🌄 Morning dua time! Start your day under Allah's protection."
"☀️ Midday reflection: Have you remembered your Creator today?"
"🌆 Evening gratitude: Don't sleep without thanking Allah."
```

### Testing Notifications

1. Enable notifications in `/settings`
2. Grant browser permission
3. Check browser console for subscription status
4. Wait for next scheduled time (or modify times for testing)
5. Notification should appear automatically

---

## 🌐 External Services

### 1. Al-Quran Cloud API
- **URL**: https://api.alquran.cloud/v1
- **Purpose**: Quran text and translations
- **Auth**: None (public API)
- **Rate Limits**: None documented
- **Endpoints Used**:
  - `/surah` - List all surahs
  - `/surah/{number}` - Get surah with verses
  - `/ayah/{reference}` - Get specific verse

### 2. Aladhan API
- **URL**: https://api.aladhan.com/v1
- **Purpose**: Prayer times calculation
- **Auth**: None (public API)
- **Rate Limits**: None documented
- **Endpoints Used**:
  - `/timingsByCity` - Get prayer times by city
  - `/calendar` - Get monthly prayer times

**Parameters**:
- `latitude` / `longitude` (from user's geolocation)
- `method` (calculation method: 1-15)
- `school` (madhab: 0=Shafi, 1=Hanafi)

### 3. OpenAI API
- **URL**: https://api.openai.com/v1
- **Purpose**: AI features
- **Auth**: Bearer token (API key)
- **Rate Limits**: Pay-as-you-go (check dashboard)
- **Endpoints Used**:
  - `/audio/transcriptions` (Whisper) - Speech-to-text
  - `/chat/completions` (GPT-4) - Text analysis

**Models**:
- `whisper-1`: Audio transcription
- `gpt-4` or `gpt-4-turbo`: Text generation

**Usage**:
- Tajweed analysis: ~500 tokens per request
- Fiqh answers: ~1000-1500 tokens per request

**Cost Estimation**:
- Whisper: $0.006 per minute of audio
- GPT-4: $0.03 per 1K input tokens, $0.06 per 1K output tokens

### 4. Supabase
- **URL**: https://[project-ref].supabase.co
- **Purpose**: Database, Auth, Storage
- **Auth**: API keys (anon, service role)
- **Rate Limits**: Free tier = 500MB DB, 1GB storage, 50K monthly active users

**Services Used**:
- PostgreSQL database
- Authentication (Email + OAuth)
- Row Level Security
- Edge Functions (not currently used)
- Storage (prepared, not yet implemented)

---

## 📁 Project Structure

```
c:/Users/HP/Downloads/OS/
├── .next/                    # Next.js build output
├── docs/                     # Documentation
│   └── GOOGLE_OAUTH_SETUP.md # Google OAuth guide
├── node_modules/             # Dependencies
├── public/                   # Static assets
│   ├── sw.js                # Service Worker
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons
├── scripts/                  # Utility scripts
│   └── sync-translations.ts # Sync Quran data
├── src/                      # Source code
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   │   ├── admin/      # Admin endpoints
│   │   │   ├── fiqh/       # Fiqh Q&A
│   │   │   ├── notifications/ # Push notifications
│   │   │   ├── quran/      # Quran analysis
│   │   │   └── sync/       # Data sync
│   │   ├── auth/           # Auth pages
│   │   │   ├── signin/    # Sign-in UI
│   │   │   ├── signup/    # Sign-up UI
│   │   │   └── callback/  # OAuth callback
│   │   ├── dashboard/      # Main dashboard
│   │   ├── fiqh/          # Fiqh Q&A page
│   │   ├── onboarding/    # Profile setup
│   │   ├── quran/         # Quran practice
│   │   ├── settings/      # User settings
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css    # Global styles
│   ├── components/         # React components
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── fiqh/          # Fiqh components
│   │   ├── landing/       # Landing sections
│   │   ├── quran/         # Quran UI
│   │   └── ui/            # Reusable UI
│   ├── context/           # React Context
│   │   └── AuthContext.tsx # Auth state
│   ├── lib/               # Utilities
│   │   ├── agents/        # AI agents
│   │   │   ├── dua-agent.ts
│   │   │   └── namaz-agent.ts
│   │   ├── analysis/      # Audio analysis
│   │   │   └── wer.ts     # Word Error Rate
│   │   ├── providers/     # API providers
│   │   │   └── whisper.ts
│   │   ├── calculateNotificationTimes.ts
│   │   ├── notificationScheduler.ts
│   │   ├── push-notifications.ts
│   │   └── supabase.ts    # Supabase client
│   ├── types/             # TypeScript types
│   │   └── database.ts   # DB schema types
│   └── middleware.ts      # Route protection
├── supabase/              # Supabase config
│   ├── functions/        # Edge Functions
│   └── migrations/       # SQL migrations
│       ├── database_schema.sql
│       ├── 02_push_notifications.sql
│       ├── 03_notifications.sql
│       └── 04_auth_profile_triggers.sql
├── .env.local            # Environment variables (gitignored)
├── .gitignore           # Git ignore rules
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies
├── tailwind.config.ts   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
└── README.md            # Project README
```

---

## 🚀 Deployment Guide

### Prerequisites
1. Vercel account
2. Supabase project (production)
3. All API keys obtained
4. Database migrations ready

### Step 1: Prepare Database

1. Log in to Supabase Dashboard
2. Go to SQL Editor
3. Run migrations in order:
   ```sql
   -- 1. Run database_schema.sql
   -- 2. Run 03_notifications.sql
   -- 3. Run 04_auth_profile_triggers.sql
   ```
4. Verify tables created successfully

### Step 2: Configure Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google provider
   - Paste Client ID
   - Paste Client Secret
   - Save

### Step 3: Deploy to Vercel

**Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add Environment Variables (see Step 4)
6. Click "Deploy"

### Step 4: Configure Environment Variables in Vercel

Settings → Environment Variables → Add:

```
NEXT_PUBLIC_SUPABASE_URL = https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon-key]
SUPABASE_SERVICE_ROLE_KEY = [service-role-key]
OPENAI_API_KEY = [openai-key]
NEXT_PUBLIC_VAPID_PUBLIC_KEY = [vapid-public]
VAPID_PRIVATE_KEY = [vapid-private]
VAPID_SUBJECT = mailto:your-email@example.com
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test Google sign-in
3. Complete onboarding
4. Test Quran practice
5. Test Fiqh Q&A
6. Enable notifications
7. Verify dashboard loads

### Step 6: Post-Deployment Tasks

1. **Sync Quran Data**:
   - Visit `https://your-app.vercel.app/api/sync/quran`
   - This populates quran_surahs and quran_verses

2. **Test All Features**:
   - Create a test account
   - Record a Quran verse
   - Ask a Fiqh question
   - Enable notifications
   - Wait for a notification to trigger

3. **Monitor Logs**:
   - Check Vercel logs for errors
   - Check Supabase logs for database issues
   - Check browser console for frontend errors

---

## 💡 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd OS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your keys
   ```

4. **Set Up Supabase**
   - Create a Supabase project
   - Run migrations in SQL Editor
   - Configure Google OAuth (optional for dev)

5. **Generate VAPID Keys**
   ```bash
   npx web-push generate-vapid-keys
   ```
   Add keys to `.env.local`

6. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Edit files
   - Test locally
   - Check browser console for errors

3. **Build & Test**
   ```bash
   npm run build
   npm start
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Deploy**
   - Merge to main (or your deploy branch)
   - Vercel auto-deploys on push

### Useful Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Generate VAPID keys
npx web-push generate-vapid-keys

# Database migrations (if using Supabase CLI)
supabase db push
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Can't see Google login button"
**Cause**: Already logged in, middleware redirects to dashboard
**Solution**: 
- Sign out first, OR
- Open incognito window, OR
- Clear browser storage:
  ```javascript
  localStorage.clear();
  sessionStorage.clear();
  location.reload();
  ```

#### 2. "Onboarding loop" (keeps redirecting to /onboarding)
**Cause**: `onboarding_completed` not being set to true
**Solution**:
- Check database:
  ```sql
  SELECT id, email, onboarding_completed FROM profiles;
  ```
- Manually set for your user:
  ```sql
  UPDATE profiles SET onboarding_completed = true WHERE email = 'your@email.com';
  ```

#### 3. "Notifications not showing"
**Cause**: Multiple possibilities
**Solutions**:
- Check browser permission (should be "Granted")
- Check Service Worker is registered (DevTools → Application → Service Workers)
- Check console for errors
- Verify VAPID keys are correct
- Check `notification_settings` table has your user's preferences
- Ensure you're on a supported browser (Chrome, Firefox, Edge)

#### 4. "API route returns 500 error"
**Cause**: Missing environment variables or database issue
**Solutions**:
- Check Vercel logs for specific error
- Verify all environment variables are set
- Check Supabase logs for database errors
- Test API route locally with `npm run dev`

#### 5. "Whisper API fails"
**Cause**: OpenAI API key issue or audio format problem
**Solutions**:
- Verify OPENAI_API_KEY is valid
- Check audio is in supported format (webm, mp3, wav)
- Check OpenAI API dashboard for errors
- Verify you have credits/billing enabled

#### 6. "Prayer times not showing"
**Cause**: Geolocation permission or API issue
**Solutions**:
- Grant location permission to browser
- Check Aladhan API is accessible
- Check browser console for errors
- Manually set location in code for testing

#### 7. "Build fails on Vercel"
**Cause**: TypeScript errors or missing dependencies
**Solutions**:
- Run `npm run build` locally to see errors
- Check all imports are correct
- Verify all dependencies are in package.json
- Check Next.js version compatibility

#### 8. "Database connection fails"
**Cause**: Invalid Supabase credentials or RLS policies
**Solutions**:
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check Supabase project is running
- Verify RLS policies allow the operation
- Check service_role key if using admin operations

---

## 📊 Analytics & Monitoring (To Be Implemented)

### Recommended Services
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics or Google Analytics
- **Performance**: Vercel Speed Insights
- **Uptime**: UptimeRobot

### Key Metrics to Track
- User signups (Google vs Email)
- Onboarding completion rate
- Quran verses practiced per day
- Fiqh questions asked per day
- Notification delivery rate
- API error rates
- Page load times

---

## 🔮 Future Enhancements

### Planned Features
1. **Gamification**
   - Achievement badges
   - Streak tracking
   - Leaderboards

2. **Social Features**
   - Study groups
   - Shared progress
   - Mentor system

3. **Advanced AI**
   - Voice similarity scoring
   - Personalized learning paths
   - Adaptive difficulty

4. **More Languages**
   - Urdu, Arabic, Malay, etc.
   - RTL support

5. **Offline Mode**
   - Progressive Web App (PWA)
   - IndexedDB caching
   - Offline verse practice

6. **Analytics Dashboard**
   - Personal statistics
   - Progress charts
   - Time spent tracking

---

## 📄 License & Credits

### Project
- **Name**: MEEK (Muslim Education & Empowerment Kit)
- **Version**: 1.0.0
- **License**: [To be determined]

### Credits
- **Quran Data**: Al-Quran Cloud API
- **Prayer Times**: Aladhan API
- **AI Models**: OpenAI (Whisper, GPT-4)
- **Database & Auth**: Supabase
- **Hosting**: Vercel
- **UI Icons**: Lucide React
- **Animations**: Framer Motion

---

## 📞 Support & Contact

For issues, questions, or contributions:
- **Issues**: [GitHub Issues](link-to-repo)
- **Email**: [your-email@example.com]
- **Documentation**: This file

---

**Document Version**: 1.0.0  
**Last Updated**: December 29, 2025  
**Author**: [Your Name]  
**Project**: MEEK - Muslim Education & Empowerment Kit

---

*This documentation is comprehensive and should serve as a complete reference for anyone starting work on this project in a new context. Keep it updated as the project evolves.*
