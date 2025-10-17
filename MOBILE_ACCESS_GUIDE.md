# Mobile Access Setup Guide

## Issue Fixed ✅
Updated `package.json` to allow mobile access to the development server.

## Steps to Access from Mobile

### 1. Restart Development Server
Stop the current server (Ctrl+C) and restart:
```powershell
npm run dev
```

The server will now listen on `0.0.0.0:3000` (all network interfaces).

### 2. Allow Through Windows Firewall

**Option A: Quick Fix (Recommended)**
When you restart the server, Windows will show a firewall prompt:
- ✅ **Check "Private networks"**
- ✅ Click **"Allow access"**

**Option B: Manual Configuration**
If you didn't see the prompt:

1. Open **Windows Defender Firewall with Advanced Security**
2. Click **"Inbound Rules"** → **"New Rule..."**
3. Select **"Port"** → Click Next
4. Select **"TCP"** → Enter **"3000"** → Click Next
5. Select **"Allow the connection"** → Click Next
6. Check **"Private"** → Click Next
7. Name it **"Next.js Dev Server"** → Click Finish

**Option C: PowerShell Command (Run as Administrator)**
```powershell
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
```

### 3. Connect from Mobile

#### Get Your Computer's IP Address:
- Your current IP: **192.168.1.40**

#### On Your Mobile Device:
1. Make sure your phone is on the **same WiFi network**
2. Open browser (Chrome, Safari, etc.)
3. Navigate to: **http://192.168.1.40:3000**

### 4. Verify Connection

**On your computer, you should see:**
```
▲ Next.js 15.5.2
- Local:        http://localhost:3000
- Network:      http://192.168.1.40:3000
```

If you see this, your mobile should be able to connect!

---

## Troubleshooting

### Still Can't Connect?

#### Check 1: Same WiFi Network
- Computer and mobile MUST be on the same WiFi
- Not mobile data, not different WiFi

#### Check 2: Windows Firewall
Run this PowerShell command to check:
```powershell
Get-NetFirewallRule -DisplayName "*Next*" | Select-Object DisplayName, Enabled, Direction, Action
```

#### Check 3: Antivirus Software
- Some antivirus software blocks network access
- Temporarily disable or add exception for port 3000

#### Check 4: Router Settings
- Some routers have "AP Isolation" or "Client Isolation" enabled
- This prevents devices from talking to each other
- Check your router settings and disable if found

#### Check 5: VPN
- If your computer is connected to a VPN, disconnect it
- VPNs can block local network access

### Check Your IP Changed
If your IP changes, run this to find it:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"} | Select-Object IPAddress
```

---

## Quick Test Commands

### Test from your computer:
```powershell
# Test if the server is listening on all interfaces
Test-NetConnection -ComputerName 192.168.1.40 -Port 3000
```

### Test from mobile browser:
Try these URLs in order:
1. `http://192.168.1.40:3000`
2. `http://192.168.1.40:3000/`
3. Check if you can ping the computer (use ping app)

---

## Success Indicators

✅ Server output shows: `Network: http://192.168.1.40:3000`
✅ Firewall rule created/allowed
✅ Mobile and PC on same WiFi
✅ No VPN blocking connection
✅ Website loads on mobile!

---

## Common Errors and Solutions

### Error: "This site can't be reached"
- **Cause:** Firewall blocking or wrong network
- **Fix:** Allow through firewall (see step 2 above)

### Error: "Connection refused"
- **Cause:** Server not listening on 0.0.0.0
- **Fix:** Already fixed in package.json, just restart server

### Error: "Took too long to respond"
- **Cause:** Router isolation or antivirus
- **Fix:** Check router AP Isolation setting

### Error: Works on computer but not mobile
- **Cause:** Different WiFi networks
- **Fix:** Verify both devices show same WiFi name

---

## Alternative: Use ngrok (Internet Access)

If local network doesn't work, use ngrok:

1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Use the https URL provided (works from anywhere!)

---

## What Changed?

**Before:**
```json
"dev": "next dev"
```
- Server only accessible from localhost

**After:**
```json
"dev": "next dev -H 0.0.0.0"
```
- Server accessible from all network interfaces
- Mobile devices can now connect!

---

## Need More Help?

If still having issues:
1. Restart both computer and router
2. Check if other devices can access (another phone/tablet)
3. Temporarily disable Windows Firewall to test
4. Use `ipconfig` to verify IP address hasn't changed
