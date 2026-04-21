#!/usr/bin/env python3
"""
Supabase Data Extractor for Mango B2C
Extracts orders, pre-orders, and contacts from Supabase and saves to CSV files
"""

import os
import csv
import requests
from datetime import datetime
from typing import List, Dict, Any

# Supabase Configuration
SUPABASE_URL = "https://qgcunxmjvnypnkusldkh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY3VueG1qdm55cG5rdXNsZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Nzk3NDksImV4cCI6MjA5MjM1NTc0OX0.963FCCD_ZnrBxDl1qaMFS71Q3cVeQD3VP0k-eZaNdS8"
REST_URL = f"{SUPABASE_URL}/rest/v1"

def get_table_data(table_name: str) -> List[Dict[str, Any]]:
    """Fetch data from a Supabase table"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{REST_URL}/{table_name}?select=*&order=created_at.desc", headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {table_name}: {e}")
        return []

def write_csv(filename: str, data: List[Dict[str, Any]], fieldnames: List[str]):
    """Write data to CSV file"""
    if not data:
        print(f"No data to write for {filename}")
        return
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    print(f"✅ {filename} created with {len(data)} records")

def extract_orders():
    """Extract orders data"""
    print("📦 Extracting orders...")
    data = get_table_data("orders")
    
    if data:
        fieldnames = [
            'id', 'created_at', 'timestamp', 'name', 'phone', 'address',
            'variety', 'variety_name', 'quantity', 'price_per_kg', 
            'total_amount', 'transaction_id', 'status'
        ]
        write_csv("orders.csv", data, fieldnames)

def extract_pre_orders():
    """Extract pre-orders data"""
    print("📋 Extracting pre-orders...")
    data = get_table_data("pre_orders")
    
    if data:
        fieldnames = [
            'id', 'created_at', 'timestamp', 'name', 'phone',
            'variety', 'variety_name', 'quantity', 'price_per_kg',
            'total_amount', 'status'
        ]
        write_csv("pre_orders.csv", data, fieldnames)

def extract_contacts():
    """Extract contacts data"""
    print("📞 Extracting contacts...")
    data = get_table_data("contacts")
    
    if data:
        fieldnames = [
            'id', 'created_at', 'timestamp', 'name', 'email', 'phone', 'message', 'status'
        ]
        write_csv("contacts.csv", data, fieldnames)

def create_summary_report():
    """Create a summary report"""
    print("📊 Creating summary report...")
    
    orders = get_table_data("orders")
    pre_orders = get_table_data("pre_orders")
    contacts = get_table_data("contacts")
    
    # Calculate statistics
    total_orders = len(orders)
    total_pre_orders = len(pre_orders)
    total_contacts = len(contacts)
    
    # Calculate revenue from confirmed orders
    total_revenue = sum(
        order.get('total_amount', 0) 
        for order in orders 
        if order.get('status') != 'Pending'
    )
    
    # Count by variety
    variety_counts = {}
    for order in orders + pre_orders:
        variety = order.get('variety_name', 'Unknown')
        variety_counts[variety] = variety_counts.get(variety, 0) + 1
    
    # Write summary report
    summary_data = [{
        'metric': 'Total Orders',
        'count': total_orders,
        'details': f'₹{total_revenue:,} revenue from {total_orders} orders'
    }, {
        'metric': 'Pre-orders',
        'count': total_pre_orders,
        'details': f'Pending pre-orders for next season'
    }, {
        'metric': 'Contact Inquiries',
        'count': total_contacts,
        'details': f'Wholesale and general inquiries'
    }, {
        'metric': 'Sindura Orders',
        'count': variety_counts.get('Sindura', 0),
        'details': f'Early season variety'
    }, {
        'metric': 'Badami Orders',
        'count': variety_counts.get('Badami', 0),
        'details': f'Premium variety orders'
    }]
    
    write_csv("summary_report.csv", summary_data, ['metric', 'count', 'details'])

def main():
    """Main function"""
    print("🥭 Mango B2C - Supabase Data Extractor")
    print("=" * 50)
    print(f"📅 Extraction Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Supabase URL: {SUPABASE_URL}")
    print("=" * 50)
    
    # Create output directory
    os.makedirs("exports", exist_ok=True)
    os.chdir("exports")
    
    # Extract all data
    extract_orders()
    extract_pre_orders()
    extract_contacts()
    create_summary_report()
    
    print("\n" + "=" * 50)
    print("✅ All data extracted successfully!")
    print("📁 Files created in 'exports' directory:")
    print("   📄 orders.csv - All customer orders")
    print("   📄 pre_orders.csv - Pre-order requests")
    print("   📄 contacts.csv - Contact inquiries")
    print("   📄 summary_report.csv - Business summary")
    print("=" * 50)

if __name__ == "__main__":
    main()
