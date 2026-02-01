/**
 * Google Apps Script — Email-gated free template delivery
 * 
 * Deploy as Web App:
 *   1. Paste this into script.google.com
 *   2. Deploy → New deployment → Web app (UPDATE existing deployment)
 *   3. Execute as: Me | Who has access: Anyone
 *   4. Copy the URL and update the form action in index.html
 *
 * Spreadsheet: 1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U
 * Columns: Email | Date | Source | Template | Purchased | Purchase Date | Last Contact | Notes
 * 
 * IMPORTANT: This script now sends the welcome email INSTANTLY on signup.
 * The email is sent from the script owner's Gmail (mike@mamv.co).
 * If you want to send as loki@mamv.co, add it as an alias in Gmail settings first.
 */

const SPREADSHEET_ID = '1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U';
const SHEET_NAME = 'Sheet1';
const TEMPLATE_URL = 'https://raw.githubusercontent.com/loki-mamv/htmldecks/main/templates/startup-pitch-free.html';
const SEND_FROM_ALIAS = 'loki@mamv.co'; // Must be configured as Gmail alias
const REPLY_TO = 'loki@mamv.co, mike@mamv.co';

/**
 * Handle CORS preflight (OPTIONS via GET fallback)
 */
function doGet(e) {
  return buildCorsResponse({ status: 'ok', message: 'Service is running.' });
}

/**
 * Handle POST — email submission with duplicate detection + INSTANT email delivery
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
      const emails = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      const purchasedCol = sheet.getRange(2, 5, lastRow - 1, 1).getValues();

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

    // New email — add row with today's date in Last Contact (email sent immediately)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    sheet.appendRow([
      email,                                    // A: Email
      new Date().toISOString(),                 // B: Date
      source,                                   // C: Source
      template,                                 // D: Template
      'No',                                     // E: Purchased
      '',                                       // F: Purchase Date
      today,                                    // G: Last Contact (set immediately)
      ''                                        // H: Notes
    ]);

    // Send welcome email INSTANTLY
    try {
      sendWelcomeEmail(email, template);
    } catch (emailErr) {
      // Log error but don't fail the signup
      console.error('Email send failed:', emailErr);
    }

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
 * Send the welcome email with the free template attached
 */
function sendWelcomeEmail(recipientEmail, templateName) {
  // Parse first name from email (best effort)
  const firstName = parseFirstName(recipientEmail);

  // Fetch the free template file
  const templateFile = UrlFetchApp.fetch(TEMPLATE_URL);
  const templateBlob = templateFile.getBlob().setName('startup-pitch-free.html');

  const subject = 'Your ' + templateName + ' template is ready';

  const htmlBody = '<p>Hey ' + firstName + ',</p>' +
    '<p>Thanks for checking out HTML Decks. Your free Startup Pitch template is attached — just download and open in any browser.</p>' +
    '<p>Quick tips:</p>' +
    '<ul>' +
    '<li>All text is editable right in the browser</li>' +
    '<li>Press F11 for fullscreen presentation mode</li>' +
    '<li>Works offline, no account needed</li>' +
    '</ul>' +
    '<p>If you want the full collection (16 templates, no watermarks, commercial license), it\'s $29 one-time: <a href="https://htmldecks.com">https://htmldecks.com</a></p>' +
    '<br><br>' +
    '<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333;">' +
    '<tr><td style="padding-bottom:8px;"><a href="https://htmldecks.com"><img src="https://htmldecks.com/logo.png" alt="HTML Decks" style="height:48px;"></a></td></tr>' +
    '<tr><td style="font-weight:bold;font-size:14px;">Loki</td></tr>' +
    '<tr><td style="color:#666;font-size:12px;">HTML Decks — Build stunning presentations in minutes</td></tr>' +
    '<tr><td style="padding-top:4px;font-size:12px;"><a href="mailto:loki@mamv.co" style="color:#5A49E1;text-decoration:none;">loki@mamv.co</a> · <a href="https://htmldecks.com" style="color:#5A49E1;text-decoration:none;">htmldecks.com</a></td></tr>' +
    '</table>';

  const options = {
    htmlBody: htmlBody,
    attachments: [templateBlob],
    replyTo: REPLY_TO,
    name: 'Loki @ HTML Decks'
  };

  // Try to send from alias, fall back to default
  try {
    GmailApp.sendEmail(recipientEmail, subject, '', options);
  } catch (aliasErr) {
    // If alias fails, send from default account
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: htmlBody,
      attachments: [templateBlob],
      replyTo: REPLY_TO,
      name: 'Loki @ HTML Decks'
    });
  }
}

/**
 * Parse a first name from an email address (best effort)
 */
function parseFirstName(email) {
  const local = email.split('@')[0];
  // Remove common separators and numbers
  const cleaned = local.replace(/[._+\-0-9]/g, ' ').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length > 0 && parts[0].length > 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
  return 'there';
}

/**
 * Build JSON response with CORS headers
 */
function buildCorsResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
