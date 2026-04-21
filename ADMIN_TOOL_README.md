# Mango B2C - Admin Data Extractor

A simple Python tool to extract all customer data from Supabase and generate CSV files for admin use.

## 🚀 Quick Start

### Option 1: Easy (Windows)
1. Double-click `extract_data.bat`
2. Wait for extraction to complete
3. Check the `exports` folder for CSV files

### Option 2: Manual (All Platforms)
1. Install Python 3.7+ if not installed
2. Install dependencies: `pip install -r requirements.txt`
3. Run extractor: `python supabase_extractor.py`

## 📁 Output Files

All files are created in an `exports` folder:

### 📄 orders.csv
All customer orders with complete details:
- Order ID, timestamp, customer info
- Mango variety, quantity, pricing
- Payment details, status

### 📄 pre_orders.csv  
Pre-order requests for next season:
- Customer contact info
- Preferred variety and quantity
- Status tracking

### 📄 contacts.csv
Contact form submissions:
- Wholesale inquiries
- General customer messages
- Contact information

### 📄 summary_report.csv
Business intelligence summary:
- Total orders and revenue
- Pre-order count
- Contact inquiries
- Variety breakdown

## 📊 Data Fields Explained

### Orders Table
- `id` - Unique order identifier
- `created_at` - Database record timestamp
- `timestamp` - Order placement time
- `name` - Customer name
- `phone` - Contact number
- `address` - Delivery address
- `variety` - Mango type (sindura/badami)
- `variety_name` - Display name (Sindura/Badami)
- `quantity` - Order quantity in kg
- `price_per_kg` - Price per kilogram
- `total_amount` - Total order value
- `transaction_id` - UPI payment reference
- `status` - Order status (Pending/Confirmed/etc.)

## 🔧 Configuration

The tool is pre-configured with your Supabase credentials:
- **URL**: https://qgcunxmjvnypnkusldkh.supabase.co
- **Key**: Already embedded

No setup required!

## 📈 Usage Examples

### Daily Order Check
Run the extractor daily to:
- Get new orders
- Update fulfillment status
- Track revenue

### Weekly Reporting  
Use the CSV files to:
- Create sales reports
- Analyze variety popularity
- Plan inventory

### Customer Service
- Export contact inquiries
- Follow up on pre-orders
- Update order statuses

## 🔒 Security Notes

- Your Supabase key is embedded in the tool
- Keep the tool files secure
- Don't share the extractor files
- Data is read-only (no modifications)

## 🛠️ Troubleshooting

### "Python not found"
- Install Python from https://python.org
- Add Python to system PATH

### "Module not found: requests"
- Run: `pip install requests`
- Or use: `pip install -r requirements.txt`

### "Connection error"
- Check internet connection
- Verify Supabase URL is correct
- Ensure Supabase project is active

### "No data found"
- Check if tables exist in Supabase
- Verify table names are correct
- Ensure there's actual data in tables

## 📞 Support

For issues with:
- **Data extraction**: Check this README
- **Supabase access**: Verify project credentials
- **CSV files**: Open in Excel/Google Sheets

---

**Made for Strait of Mangoes - Ramanagara** 🥭
