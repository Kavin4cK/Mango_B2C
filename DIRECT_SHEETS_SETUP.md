# Direct Google Sheets Integration - Simple Setup

## Option 1: Use Zapier Webhook (Easiest)

1. **Create a Zapier Account** (free tier available)
2. **Create a Zap**: Webhook → Google Sheets
3. **Setup Webhook**:
   - Trigger: "Catch Hook"
   - Copy the webhook URL provided
4. **Setup Google Sheets**:
   - Action: "Create Spreadsheet Row"
   - Connect your Google account
   - Select your spreadsheet: "1KN2Bn04DQLSSK42veFk3X0nZbnjhio-Le0xp-NJJkcE"
   - Map the fields:
     - Timestamp: `timestamp`
     - Name: `name`
     - Phone: `phone`
     - Address: `address`
     - Variety: `variety`
     - Variety Name: `varietyName`
     - Quantity: `quantity`
     - Price per kg: `pricePerKg`
     - Total Amount: `totalAmount`
     - Transaction ID: `transactionId`
     - Status: `status`

5. **Update your React App**:
   Replace the webhook URL in `src/App.tsx`:
   ```javascript
   const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/123456/abcdef/'; // Replace with your actual webhook URL
   ```

## Option 2: Use Make.com (formerly Integromat)

1. **Create a Make.com Account** (free tier)
2. **Create a Scenario**: Webhook → Google Sheets
3. **Setup Webhook**:
   - Add "Webhooks" → "Custom Webhook"
   - Copy the webhook URL
4. **Setup Google Sheets**:
   - Add "Google Sheets" → "Add a Row"
   - Connect your Google account
   - Select your spreadsheet and sheet
   - Map the fields from webhook to sheet columns

## Option 3: Use Pabbly Connect (Free Forever)

1. **Create a Pabbly Account**
2. **Create Workflow**: Webhook → Google Sheets
3. **Setup similar to Zapier**

## Option 4: Use Google Apps Script (Most Direct)

If you want to avoid third-party services:

1. **Go to Google Apps Script**: script.google.com
2. **Create New Project**
3. **Paste this code**:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheetId = '1KN2Bn04DQLSSK42veFk3X0nZbnjhio-Le0xp-NJJkcE';
    const sheetName = 'Orders';
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet(sheetName);
      const headers = ['Timestamp', 'Name', 'Phone', 'Address', 'Variety', 'Variety Name', 'Quantity', 'Price per kg', 'Total Amount', 'Transaction ID', 'Status'];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const newRow = [
      data.timestamp,
      data.name,
      data.phone,
      data.address,
      data.variety,
      data.varietyName,
      data.quantity,
      data.pricePerKg,
      data.totalAmount,
      data.transactionId,
      data.status
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Deploy as Web App**:
   - Click "Deploy" → "New Deployment"
   - Type: "Web App"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Copy the Web App URL

5. **Update React App**:
   ```javascript
   const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
   ```

## Recommended: Use Zapier (Easiest)

For your use case, I recommend **Zapier** because:
- Free tier handles hundreds of orders per month
- Very reliable
- Easy to set up
- No coding required
- Direct integration with Google Sheets

## Testing Your Integration

1. Set up your chosen service
2. Update the webhook URL in `src/App.tsx`
3. Test by placing an order
4. Check your Google Sheet - data should appear instantly

The webhook approach is much simpler than trying to use Google Sheets API directly from the browser (which requires complex authentication).
