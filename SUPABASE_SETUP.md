# Supabase Setup Guide for Mango B2C

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with your GitHub/Google account
4. Create a new project:
   - **Organization**: Your name/company
   - **Project Name**: `mango-b2c`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Project Credentials

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Create Database Tables

Go to **Table Editor** → **Create a new table** and create these tables:

### Table 1: `orders`

```sql
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  timestamp timestamptz NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  variety text NOT NULL,
  variety_name text NOT NULL,
  quantity integer NOT NULL,
  price_per_kg integer NOT NULL,
  total_amount integer NOT NULL,
  transaction_id text,
  status text DEFAULT 'Pending'::text
);
```

### Table 2: `pre_orders`

```sql
CREATE TABLE pre_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  timestamp timestamptz NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  variety text NOT NULL,
  variety_name text NOT NULL,
  quantity integer NOT NULL,
  price_per_kg integer NOT NULL,
  total_amount integer NOT NULL,
  status text DEFAULT 'Pre-order'::text
);
```

### Table 3: `contacts` (for contact form)

```sql
CREATE TABLE contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  timestamp timestamptz NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  message text,
  status text DEFAULT 'New'::text
);
```

## 4. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```

Or update the existing `.env.example` and create `.env.local` with your actual values.

## 5. Test the Integration

1. Run your app: `npm run dev`
2. Place a test order
3. Check your Supabase dashboard → Table Editor
4. You should see the order data in the `orders` table

## 6. Optional: Set Up Row Level Security (RLS)

For production, enable RLS on your tables:

1. Go to **Authentication** → **Policies**
2. Enable RLS on each table
3. Add policies to allow insert operations

Example policy for `orders` table:
```sql
CREATE POLICY "Enable insert for all users" ON orders
  FOR INSERT WITH CHECK (true);
```

## 7. Optional: Set Up Real-time Subscriptions

You can get real-time updates when new orders come in:

```javascript
// In your app, you can listen for new orders
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('New order received:', payload.new)
      // You can show a notification here
    }
  )
  .subscribe()
```

## Benefits of Supabase

- **Real-time**: Get instant notifications for new orders
- **Secure**: Built-in authentication and RLS
- **Scalable**: Handles millions of rows
- **Free tier**: Generous free plan for small businesses
- **Dashboard**: Beautiful UI to view and manage data
- **API**: Auto-generated REST API

## Troubleshooting

If orders don't appear:
1. Check browser console for errors
2. Verify your Supabase URL and keys are correct
3. Ensure tables exist with correct column names
4. Check that RLS policies allow inserts
5. Verify network connectivity to Supabase

## Data Export

You can export data anytime:
- Go to Table Editor → Export
- Choose CSV, Excel, or JSON format
- Perfect for accounting and order fulfillment
