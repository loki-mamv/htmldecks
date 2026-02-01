#!/bin/bash
# HTML Decks Email Delivery Worker
# Polls Google Sheet every 60s, sends welcome emails from loki@mamv.co
# Run via pm2: pm2 start email-worker.sh --name htmldecks-email

SHEET_ID="1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U"
TEMPLATE="/Users/loki/assistant/projects/deckkit/templates/startup-pitch-free.html"
GOG="/opt/homebrew/bin/gog"
HIMALAYA="/opt/homebrew/bin/himalaya"

send_welcome_email() {
  local email="$1"
  local template_name="$2"
  
  # Parse first name from email
  local local_part="${email%%@*}"
  local first_name=$(echo "$local_part" | sed 's/[._+0-9-]/ /g' | awk '{print toupper(substr($1,1,1)) tolower(substr($1,2))}')
  [ ${#first_name} -le 1 ] && first_name="there"

  cat << MMLEOF | $HIMALAYA template send -a loki
From: loki@mamv.co
To: ${email}
Reply-To: loki@mamv.co, mike@mamv.co
Subject: Your ${template_name} template is ready
Content-Type: text/html
<mml:attachment filename="startup-pitch-free.html" content-type="text/html">
  <mml:external-resource uri="file://${TEMPLATE}" />
</mml:attachment>

<p>Hey ${first_name},</p>

<p>Thanks for checking out HTML Decks. Your free Startup Pitch template is attached — just download and open in any browser.</p>

<p>Quick tips:</p>
<ul>
<li>All text is editable right in the browser</li>
<li>Press F11 for fullscreen presentation mode</li>
<li>Works offline, no account needed</li>
</ul>

<p>If you want the full collection (16 templates, no watermarks, commercial license), it's \$29 one-time: <a href="https://htmldecks.com">https://htmldecks.com</a></p>

<br><br>
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333;">
<tr><td style="padding-bottom:8px;"><a href="https://htmldecks.com"><img src="https://htmldecks.com/logo.png" alt="HTML Decks" style="height:48px;"></a></td></tr>
<tr><td style="font-weight:bold;font-size:14px;">Loki</td></tr>
<tr><td style="color:#666;font-size:12px;">HTML Decks — Build stunning presentations in minutes</td></tr>
<tr><td style="padding-top:4px;font-size:12px;"><a href="mailto:loki@mamv.co" style="color:#5A49E1;text-decoration:none;">loki@mamv.co</a> · <a href="https://htmldecks.com" style="color:#5A49E1;text-decoration:none;">htmldecks.com</a></td></tr>
</table>
MMLEOF
}

echo "[$(date)] HTML Decks email worker started"

while true; do
  # Get sheet data as JSON
  DATA=$($GOG sheets get "$SHEET_ID" "Sheet1!A:H" --account mike@mamv.co --json 2>/dev/null)
  
  if [ -z "$DATA" ]; then
    echo "[$(date)] Failed to fetch sheet"
    sleep 60
    continue
  fi

  # Find rows needing email: Purchased=No AND Last Contact empty
  PENDING=$(echo "$DATA" | jq -r '.values[1:][] | select(length >= 5) | select(.[4] == "No") | select(length < 7 or .[6] == "" or .[6] == null) | "\(.[0])|\(.[3])"')

  if [ -n "$PENDING" ]; then
    ROW=2  # Start after header
    echo "$DATA" | jq -r '.values[1:][] | "\(.[0])|\(if length >= 5 then .[4] else "" end)|\(if length >= 7 then .[6] else "" end)"' | while IFS='|' read -r email purchased contact; do
      ROW=$((ROW + 1))
      if [ "$purchased" = "No" ] && [ -z "$contact" ]; then
        # Get template name for this row
        TMPL=$(echo "$DATA" | jq -r ".values[$((ROW-1))][3] // \"startup-pitch\"")
        
        echo "[$(date)] Sending welcome email to: $email (template: $TMPL)"
        
        if send_welcome_email "$email" "$TMPL"; then
          TODAY=$(date +%Y-%m-%d)
          $GOG sheets update "$SHEET_ID" "Sheet1!G${ROW}" "$TODAY" --account mike@mamv.co 2>/dev/null
          echo "[$(date)] ✅ Sent and updated sheet row $ROW"
        else
          echo "[$(date)] ❌ Failed to send to $email"
        fi
      fi
    done
  fi

  sleep 60
done
