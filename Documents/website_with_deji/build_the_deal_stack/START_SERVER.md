# How to Run Build the Deal Stack Locally

## ✅ NO SERVER REQUIRED!

**Good news:** The application now works perfectly without a server! Just double-click `index.html` and it will open in your browser.

The CORS issue has been resolved by converting from ES6 modules to traditional script tags with global variables.

---

## Quick Start (Simplest Method)

1. Navigate to: `C:\Users\ELEKTRAN\Documents\website_with_deji\build_the_deal_stack`
2. Double-click `index.html`
3. Application opens in your default browser ✅

**That's it!** No server, no setup, no installation required.

---

## Optional: Run with Local Server (For Better Development Experience)

While not required, you can still run a local server if you prefer. Benefits include:
- Better debugging experience
- Closer to production environment
- Some browser extensions work better with HTTP

**Note:** This is completely optional now!

---

## ✅ Recommended Solutions

### Option 1: Python Simple HTTP Server (Easiest)

**If you have Python installed:**

#### Python 3.x (Most Common)
1. Open terminal/command prompt in the project folder
2. Run:
   ```bash
   python -m http.server 8000
   ```

#### Python 2.x (Older)
```bash
python -m SimpleHTTPServer 8000
```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

4. To stop the server: Press `Ctrl+C` in the terminal

---

### Option 2: Node.js http-server (If You Have Node)

1. Install http-server globally (one-time):
   ```bash
   npm install -g http-server
   ```

2. Run in project folder:
   ```bash
   http-server -p 8000
   ```

3. Open browser:
   ```
   http://localhost:8000
   ```

---

### Option 3: VS Code Live Server Extension (If Using VS Code)

1. Install "Live Server" extension by Ritwick Dey
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically at `http://127.0.0.1:5500`

**Bonus:** Auto-reloads on file changes!

---

### Option 4: PHP Built-in Server (If You Have PHP)

```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

### Option 5: Browser Extension (Quick Fix)

**Chrome/Edge:**
- Install "Web Server for Chrome" extension
- Configure to serve your project folder
- Access via `http://127.0.0.1:8887`

---

## 🚀 Quick Start (Copy-Paste)

### Windows (PowerShell):
```powershell
# Navigate to project folder
cd "C:\Users\ELEKTRAN\Documents\website_with_deji\build_the_deal_stack"

# Run Python server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Windows (Command Prompt):
```cmd
cd C:\Users\ELEKTRAN\Documents\website_with_deji\build_the_deal_stack
python -m http.server 8000
```

### Mac/Linux:
```bash
cd /path/to/build_the_deal_stack
python3 -m http.server 8000
```

---

## ✅ Verify It's Working

Once the server is running, you should see:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

Open browser to `http://localhost:8000` and:
- No CORS errors in console
- ES6 modules load successfully
- Application works normally

---

## 🛑 Alternative: Remove ES6 Modules (Not Recommended)

If you absolutely cannot run a server, you can refactor the code to use traditional `<script>` tags instead of modules. However, this is **not recommended** as it:
- Makes code less modular
- Uses global variables (pollutes global scope)
- Goes against modern JavaScript best practices

---

## 📝 Development Workflow

1. **Start server** in terminal:
   ```bash
   python -m http.server 8000
   ```

2. **Open browser** to `http://localhost:8000`

3. **Make changes** to your files

4. **Refresh browser** to see changes (F5)

5. **Stop server** when done: `Ctrl+C`

---

## 🔍 Troubleshooting

### "python is not recognized"
- Python is not installed or not in PATH
- Download from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

### Port 8000 already in use
- Change port number:
  ```bash
  python -m http.server 8080
  ```
- Then use `http://localhost:8080`

### Changes not reflecting
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache: F12 → Network tab → "Disable cache" checkbox

### Still seeing CORS errors
- Verify you're using `http://localhost:8000` NOT `file://`
- Check browser address bar starts with `http://`
- Clear browser cache and try again

---

## 🎯 For Production/Deployment

When deploying to a real server (Netlify, Vercel, GitHub Pages, etc.), this CORS issue won't occur because files are served over HTTP/HTTPS automatically.

This is **only** a local development issue with the `file://` protocol.

---

**Recommended for this project:** Python's simple HTTP server (Option 1) - it's built-in, requires zero configuration, and works perfectly for development.

---

**Last Updated:** January 14, 2026
