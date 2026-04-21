# Vercel Environment Variables Setup

Your Mango B2C app has been successfully deployed! 

## Live URL: https://mango-b2-c-five.vercel.app

## Required Environment Variables

To make the Supabase integration work, you need to set these environment variables in your Vercel dashboard:

### Steps:
1. Go to your Vercel project dashboard: https://vercel.com/kavin-krishnan-cs-projects/mango-b2-c
2. Click on **Settings** tab
3. Click on **Environment Variables** 
4. Add these two variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://qgcunxmjvnypnkusldkh.supabase.co`
- Environments: Production, Preview, Development

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `sb_publishable_2TKRj6SvM566GvNvbcsuCA_7xMYp44a`
- Environments: Production, Preview, Development

5. Click **Save**
6. **Redeploy** the project (Vercel will prompt you)

## What's Working Now:
- React app is live with your images
- Sindura uses img6.jpeg
- Badami uses img5.jpeg  
- Gallery uses img1-4.jpeg
- All UI and navigation working

## After Setting Environment Variables:
- Order forms will save to Supabase
- Pre-orders will be captured
- Contact messages will be stored
- Admin extractor will work

## Test the App:
1. Visit: https://mango-b2-c-five.vercel.app
2. Try placing an order
3. Check your Supabase dashboard for data

Your Mango B2C app is now live with your images! Just add the environment variables to enable database functionality.
