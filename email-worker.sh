#!/bin/bash
# HTML Decks Email Delivery Worker
# Polls Google Sheet every 60s
# Sends welcome email from loki@mamv.co, founder follow-up from mike@mamv.co 5 min later
# Run via pm2: pm2 start email-worker.sh --name htmldecks-email --interpreter bash

SHEET_ID="1WPabI2YM93qvZg_b4AgGUN9lDJ5Kipj-iRmw-ryYd0U"
TEMPLATE="/Users/loki/assistant/projects/deckkit/templates/startup-pitch-free.html"
GOG="/opt/homebrew/bin/gog"
HIMALAYA="/opt/homebrew/bin/himalaya"
FOLLOWUP_DIR="/tmp/htmldecks-followups"
mkdir -p "$FOLLOWUP_DIR"

parse_first_name() {
  local email="$1"
  local local_part="${email%%@*}"
  local cleaned
  cleaned=$(echo "$local_part" | sed 's/[._+0-9-]/ /g')
  local first
  first=$(echo "$cleaned" | awk '{print $1}')
  if [ ${#first} -le 1 ]; then
    echo "there"
  else
    echo "$first" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}'
  fi
}

send_welcome_email() {
  local email="$1"
  local first_name
  first_name=$(parse_first_name "$email")

  # Write MML to temp file to avoid heredoc issues
  local tmpfile
  tmpfile=$(mktemp /tmp/htmldecks-email-XXXXXX.mml)

  cat > "$tmpfile" << EOF
From: Loki <loki@mamv.co>
To: ${email}
Reply-To: loki@mamv.co, mike@mamv.co
Subject: HTML Decks - Your free beautiful deck!

Hey ${first_name},

Thanks for checking out HTML Decks. Your free Startup Pitch template is attached — just download and open in any browser.

Quick tips:
- All text is editable right in the browser
- Press F11 for fullscreen presentation mode
- Works offline, no account needed

If you want the full collection (16 templates, no watermarks, commercial license), it's \$29 one-time: https://htmldecks.com

— Loki
loki@mamv.co | htmldecks.com
<#part type=application/octet-stream filename="${TEMPLATE}"><#/part>
EOF

  $HIMALAYA template send -a loki < "$tmpfile"
  local result=$?
  rm -f "$tmpfile"
  return $result
}

send_founder_followup() {
  local email="$1"
  local first_name
  first_name=$(parse_first_name "$email")

  local tmpfile
  tmpfile=$(mktemp /tmp/htmldecks-followup-XXXXXX.mml)

  cat > "$tmpfile" << EOF
From: Mike Maseda <mike@mamv.co>
To: ${email}
Reply-To: mike@mamv.co
Subject: Thanks for trying HTML Decks

Hey ${first_name},

Mike here — I'm the founder of HTML Decks.

I saw you just signed up and wanted to say thanks personally. I built this because I was tired of paying monthly fees for presentation software that barely works offline. Figured there had to be a simpler way.

Turns out, a single HTML file does everything PowerPoint does — minus the headaches. No installs, no accounts, no "your trial has expired." Just open it in a browser and go.

If you run into anything weird or have an idea for a template you'd want to see, just reply to this email. I read every one.

Thanks for checking it out.

Mike
Founder, HTML Decks
https://htmldecks.com
EOF

  $HIMALAYA template send -a mamv < "$tmpfile"
  local result=$?
  rm -f "$tmpfile"
  return $result
}

echo "[$(date)] HTML Decks email worker started"

while true; do
  # --- Check for pending follow-ups (5 min delay) ---
  NOW=$(date +%s)
  for f in "$FOLLOWUP_DIR"/*.pending; do
    [ -f "$f" ] || continue
    SEND_AT=$(head -1 "$f")
    EMAIL=$(tail -1 "$f")
    if [ "$NOW" -ge "$SEND_AT" ]; then
      echo "[$(date)] Sending founder follow-up to: $EMAIL"
      if send_founder_followup "$EMAIL"; then
        echo "[$(date)] Founder follow-up sent to $EMAIL"
        rm -f "$f"
      else
        echo "[$(date)] Failed founder follow-up to $EMAIL"
      fi
    fi
  done

  # --- Check for new signups ---
  DATA=$($GOG sheets get "$SHEET_ID" "Sheet1!A:H" --account mike@mamv.co --json 2>/dev/null)
  
  if [ -z "$DATA" ]; then
    echo "[$(date)] Failed to fetch sheet"
    sleep 60
    continue
  fi

  # Process each row
  ROW=1
  echo "$DATA" | jq -c '.values[1:][]' | while read -r row; do
    ROW=$((ROW + 1))
    EMAIL=$(echo "$row" | jq -r '.[0] // ""')
    PURCHASED=$(echo "$row" | jq -r '.[4] // ""')
    CONTACT=$(echo "$row" | jq -r '.[6] // ""')

    if [ "$PURCHASED" = "No" ] && [ -z "$CONTACT" ]; then
      echo "[$(date)] Sending welcome email to: $EMAIL"
      
      if send_welcome_email "$EMAIL"; then
        TODAY=$(date +%Y-%m-%d)
        $GOG sheets update "$SHEET_ID" "Sheet1!G${ROW}" "$TODAY" --account mike@mamv.co 2>/dev/null
        echo "[$(date)] Welcome email sent, sheet updated row $ROW"
        
        # Schedule founder follow-up for 5 min from now
        SEND_AT=$(( $(date +%s) + 300 ))
        SAFE_EMAIL=$(echo "$EMAIL" | sed 's/[^a-zA-Z0-9@._-]//g')
        echo "$SEND_AT" > "$FOLLOWUP_DIR/${SAFE_EMAIL}.pending"
        echo "$EMAIL" >> "$FOLLOWUP_DIR/${SAFE_EMAIL}.pending"
        echo "[$(date)] Founder follow-up scheduled for $EMAIL in 5 min"
      else
        echo "[$(date)] Failed to send to $EMAIL"
      fi
    fi
  done

  sleep 60
done
