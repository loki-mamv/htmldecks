/**
 * Google Apps Script — Email-gated free template delivery
 * 
 * Deploy as Web App:
 *   1. Paste this into script.google.com
 *   2. Deploy → New deployment → Web app
 *   3. Execute as: Me | Who has access: Anyone
 *   4. Copy the URL and update the form action in index.html
 *
 * Spreadsheet: 1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U
 * Columns: Email | Date | Source | Template | Purchased | Purchase Date | Last Contact | Notes
 */

const SPREADSHEET_ID = '1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U';
const SHEET_NAME = 'Sheet1';

/**
 * Handle CORS preflight (OPTIONS via GET fallback)
 */
function doGet(e) {
  return buildCorsResponse({ status: 'ok', message: 'Service is running.' });
}

/**
 * Handle POST — email submission with duplicate detection
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const email = (data.email || '').trim().toLowerCase();
    const source = data.source || 'unknown';
    const template = data.template || 'unknown';

    if (!email || !email.includes('@')) {
      return buildCorsResponse({ status: 'error', message: 'Please enter a valid email address.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Check for existing email (column A, case-insensitive)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // Skip header
      const purchasedCol = sheet.getRange(2, 5, lastRow - 1, 1).getValues(); // Column E = Purchased

      for (let i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).trim().toLowerCase() === email) {
          const purchased = String(purchasedCol[i][0]).trim().toLowerCase();
          if (purchased === 'yes') {
            return buildCorsResponse({
              status: 'purchased',
              message: 'Welcome back! Enter your license key to download any template.'
            });
          } else {
            return buildCorsResponse({
              status: 'exists',
              message: "You've already claimed a free template. Get all 16 templates for $29."
            });
          }
        }
      }
    }

    // New email — add row
    sheet.appendRow([
      email,                                    // A: Email
      new Date().toISOString(),                 // B: Date
      source,                                   // C: Source
      template,                                 // D: Template
      'No',                                     // E: Purchased
      '',                                       // F: Purchase Date
      '',                                       // G: Last Contact
      ''                                        // H: Notes
    ]);

    return buildCorsResponse({
      status: 'new',
      message: 'Check your email for your template!'
    });

  } catch (err) {
    return buildCorsResponse({
      status: 'error',
      message: 'Something went wrong. Please try again.'
    });
  }
}

/**
 * Build JSON response with CORS headers
 */
function buildCorsResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
