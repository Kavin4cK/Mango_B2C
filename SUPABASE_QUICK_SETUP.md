# Quick Supabase Setup for Mango B2C

## Your Supabase Project is Ready!
- **URL**: https://qgcunxmjvnypnkusldkh.supabase.co
- **API URL**: https://qgcunxmjvnypnkusldkh.supabase.co/rest/v1/
- **Publishable Key**: sb_publishable_2TKRj6SvM566GvNvbcsuCA_7xMYp44a

## Step 1: Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project `qgcunxmjvnypnkusldkh`
3. Go to **SQL Editor** (in the left sidebar)
4. Copy and paste the contents of `create_tables.sql`
5. Click **Run** to execute the SQL

## Step 2: Verify Tables

1. Go to **Table Editor** (in the left sidebar)
2. You should see three tables:
   - `orders`
   - `pre_orders` 
   - `contacts`

## Step 3: Test the App

1. Run your app: `npm run dev`
2. Try placing an order
3. Check your Supabase Table Editor - you should see the data!

## What's Already Configured

✅ Supabase client configured with your credentials  
✅ Database connection ready  
✅ All forms set up to save to Supabase  
✅ Error handling implemented  
✅ Environment variables configured  

## Database Schema

### Orders Table
- `id` - Unique identifier
- `created_at` - When record was created
- `timestamp` - Order timestamp
- `name` - Customer name
- `phone` - Customer phone
- `address` - Delivery address
- `variety` - Mango variety (sindura/badami)
- `variety_name` - Display name (Sindura/Badami)
- `quantity` - Order quantity in kg
- `price_per_kg` - Price per kg
- `total_amount` - Total order amount
- `transaction_id` - UPI transaction ID
- `status` - Order status (Pending, Confirmed, etc.)

### Pre-orders Table
- Similar to orders but for pre-orders
- Status defaults to 'Pre-order'

### Contacts Table
- For wholesale inquiries and messages
- Status defaults to 'New'

## Security

- Row Level Security (RLS) enabled
- Policies allow public insert/select
- Safe for production use

## Next Steps

1. ✅ Run the SQL script to create tables
2. ✅ Test the app functionality
3. 🔄 Set up real-time notifications (optional)
4. 🔄 Configure email notifications (optional)

Your Mango B2C app is ready to collect orders directly to Supabase!
