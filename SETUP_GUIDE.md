# Strait of Mangoes - Google Forms Setup Guide

To enable order tracking and email notifications, follow these steps to connect your website to Google Forms.

## 1. Create the Order Form
1. Go to [Google Forms](https://forms.google.com).
2. Create a new form titled **"Mango Farm Orders"**.
3. Add the following fields (all as **Short Answer** or **Paragraph**):
   - **Customer Name** (Short Answer)
   - **Phone Number** (Short Answer)
   - **Delivery Address** (Paragraph)
   - **Mango Variety** (Short Answer)
   - **Quantity (kg)** (Short Answer)
   - **Total Paid (₹)** (Short Answer)
   - **Transaction ID** (Short Answer)

## 2. Create the Pre-order Form
1. Create another form titled **"Mango Pre-orders"**.
2. Add the following fields:
   - **Customer Name** (Short Answer)
   - **Phone Number** (Short Answer)
   - **Preferred Variety** (Short Answer)
   - **Estimated Quantity** (Short Answer)

## 3. Map Form Fields to Website
To make the "Silent Submit" work, you need to find the `entry.ID` for each field:
1. Open your live Google Form in a browser.
2. Right-click anywhere and select **"View Page Source"**.
3. Search (Ctrl+F) for `entry.`. You will see numbers like `entry.123456789`.
4. Update the `App.tsx` file in the following locations:
   - Search for `FORM_URL` and replace with your Form's `/formResponse` URL.
   - Search for `formData.append('entry.1111111', ...)` and replace the numbers with your actual entry IDs.

## 4. Enable Email Notifications
1. In your Google Form, go to the **"Responses"** tab.
2. Click **"Link to Sheets"** to create a spreadsheet for your orders.
3. In the Google Sheet, go to **Extensions > Apps Script**.
4. You can use a simple script or just go to **Tools > Notification Rules** in the Sheet to get an email whenever a new row is added.
5. Alternatively, inside Google Forms, click the **three dots (⋮) > Get email notifications for new responses**.

## 5. Deployment
Your website is ready. Simply run:
```bash
npm run build
```
The contents of the `dist` folder are your production-ready website files. This includes a single `index.html` (bundled with CSS/JS) which can be hosted on GitHub Pages, Netlify, or any static host.
