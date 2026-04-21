# Google Sheets Integration Setup Guide

## Overview
This guide helps you set up automatic order data collection from your Mango B2C app to Google Sheets.

## Step 1: Prepare Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1KN2Bn04DQLSSK42veFk3X0nZbnjhio-Le0xp-NJJkcE/edit

2. Create a new sheet named "Orders" (if it doesn't exist)

3. Add these headers in the first row (A1:K1):
   - Timestamp
   - Name
   - Phone
   - Address
   - Variety ID
   - Variety Name
   - Quantity (kg)
   - Price per kg
   - Total Amount
   - Transaction ID
   - Status

## Step 2: Create Google Apps Script

1. Go to Google Apps Script: https://script.google.com/home

2. Click "New Project"

3. Replace the default code with the content from `google-sheets-script.js`

4. Save the project (Ctrl + S)

## Step 3: Deploy as Web App

1. Click "Deploy" → "New Deployment"

2. Select type: "Web App"

3. Configure:
   - Description: "Mango Orders API"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (for public access from your app)

4. Click "Deploy"

5. **Important**: You'll need to authorize the permissions requested

6. Copy the Web app URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec`)

## Step 4: Update Your React App

1. In `src/App.tsx`, find this line:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
   ```

2. Replace `YOUR_SCRIPT_ID_HERE` with your actual script ID from the deployed Web App URL

## Step 5: Test the Integration

1. Run your React app
2. Complete an order through the app
3. Check your Google Sheet - the order data should appear automatically

## Data Structure

Each order will contain:
- **Timestamp**: ISO date/time when order was placed
- **Name**: Customer's full name
- **Phone**: Contact number
- **Address**: Delivery address
- **Variety ID**: sindura/badami
- **Variety Name**: Sindura/Badami
- **Quantity**: Order quantity in kg
- **Price per kg**: ₹80 or ₹100
- **Total Amount**: Calculated total
- **Transaction ID**: UPI transaction reference
- **Status**: Initially "Pending"

## Security Notes

- The Web App URL is public - anyone who has it can submit data
- Consider adding a simple API key if needed
- Regularly check your sheet for spam entries
- You can add data validation in the Apps Script if needed

## Troubleshooting

If orders don't appear in your sheet:
1. Check the browser console for errors
2. Verify the Web App URL is correct
3. Ensure the Google Sheet is shared with "Anyone with link can view"
4. Check that the Apps Script has proper permissions
5. Test the Apps Script using the `testOrder()` function

## Alternative: Use Google Forms (Simpler)

If the Apps Script approach is too complex, you can:
1. Create a Google Form with the same fields
2. Get the form's submission URL
3. Update the `handleOrderSubmit` function to submit to the form instead

The form data will automatically appear in a connected Google Sheet.
