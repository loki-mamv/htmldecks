/**
 * Google Apps Script — Email-gated free template collection
 * 
 * Deploy as Web App (UPDATE existing deployment):
 *   1. Paste into script.google.com
 *   2. Deploy → Manage deployments → Edit → New version → Deploy
 *
 * Spreadsheet: 1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U
 * Columns: Email | Date | Source | Template | Purchased | Purchase Date | Last Contact | Notes
 * 
 * Email delivery handled separately by Loki via himalaya (sends from loki@mamv.co).
 */

const SPREADSHEET_ID = '1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U';
const SHEET_NAME = 'Sheet1';

// VIP emails that can download unlimited templates
const VIP_EMAILS = ['mike@mamv.co', 'mmaseda32@gmail.com'];

function doGet(e) {
  return buildCorsResponse({ status: 'ok', message: 'Service is running.' });
}

/**
 * Normalize email: strip +aliases and lowercase
 * mike+test@mamv.co → mike@mamv.co
 * user+anything@gmail.com → user@gmail.com
 */
function normalizeEmail(email) {
  var parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return email.toLowerCase().trim();
  var local = parts[0].split('+')[0]; // Strip everything after +
  return local + '@' + parts[1];
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var rawEmail = (data.email || '').trim().toLowerCase();
    var source = data.source || 'unknown';
    var template = data.template || 'unknown';

    if (!rawEmail || rawEmail.indexOf('@') === -1) {
      return buildCorsResponse({ status: 'error', message: 'Please enter a valid email address.' });
    }

    var normalized = normalizeEmail(rawEmail);
    var isVip = VIP_EMAILS.indexOf(normalized) !== -1;

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Check for existing email — compare NORMALIZED versions
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && !isVip) {
      var emails = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      var purchasedCol = sheet.getRange(2, 5, lastRow - 1, 1).getValues();

      for (var i = 0; i < emails.length; i++) {
        var existingNormalized = normalizeEmail(String(emails[i][0]));
        if (existingNormalized === normalized) {
          var purchased = String(purchasedCol[i][0]).trim().toLowerCase();
          if (purchased === 'yes') {
            return buildCorsResponse({ status: 'purchased', message: 'Welcome back! Enter your license key to download any template.' });
          } else {
            return buildCorsResponse({ status: 'exists', message: "You've already claimed a free template. Get all 16 templates for $29." });
          }
        }
      }
    }

    // VIP always gets through, new emails get added
    sheet.appendRow([rawEmail, new Date().toISOString(), source, template, 'No', '', '', isVip ? 'VIP' : '']);
    return buildCorsResponse({ status: 'new', message: 'Check your email for your template!' });
  } catch (err) {
    return buildCorsResponse({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
}

function buildCorsResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
