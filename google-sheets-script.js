// Google Apps Script for Mango Orders
// Deploy this as a Web App: https://script.google.com/home

function doGet(e) {
  return HtmlService.createHtmlOutput("Mango Orders API - POST only");
}

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet
    const spreadsheetId = '1KN2Bn04DQLSSK42veFk3X0nZbnjhio-Le0xp-NJJkcE';
    const sheetName = 'Orders'; // Make sure you have a sheet named 'Orders'
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      // Create the sheet if it doesn't exist
      const newSheet = spreadsheet.insertSheet(sheetName);
      // Add headers
      const headers = [
        'Timestamp',
        'Name',
        'Phone',
        'Address',
        'Variety ID',
        'Variety Name',
        'Quantity (kg)',
        'Price per kg',
        'Total Amount',
        'Transaction ID',
        'Status'
      ];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      newSheet.getRange("A1:K1").setFontWeight("bold");
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Sheet created and order added"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add new row with order data
    const newRow = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.address || '',
      data.variety || '',
      data.varietyName || '',
      data.quantity || '',
      data.pricePerKg || '',
      data.totalAmount || '',
      data.transactionId || '',
      data.status || 'Pending'
    ];
    
    sheet.appendRow(newRow);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 11).setFontWeight("normal");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order added successfully",
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function testOrder() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: "Test Customer",
    phone: "+919999999999",
    address: "Test Address, Bangalore",
    variety: "badami",
    varietyName: "Badami",
    quantity: "5",
    pricePerKg: "100",
    totalAmount: "500",
    transactionId: "TEST123",
    status: "Pending"
  };
  
  // Simulate doPost
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(e);
}
