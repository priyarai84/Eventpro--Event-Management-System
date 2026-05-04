<!-- ════════════════════════════════════════════════════════════════════════════════ -->
<!--   SETUP AND TROUBLESHOOTING GUIDE - UPDATED WITH SQLITE
      Complete guide for running EventPro successfully
<!-- ════════════════════════════════════════════════════════════════════════════════ -->

# EventPro - Complete Setup Guide (SQLite Edition)

## ✅ **PRE-SETUP CHECKLIST**

Before starting, make sure you have:
- [ ] Node.js installed (v14+) - Download from https://nodejs.org/
- [ ] VS Code or any code editor
- [ ] All files properly extracted

---

## 🚀 **QUICK START (5 MINUTES)**

### **Step 1: Install Node.js Dependencies**

```bash
cd "c:\Users\theas\Desktop\Event Prgm\Event Pro\backend"
npm install
```

This will install:
- express (server framework)
- cors (cross-origin requests)
- better-sqlite3 (lightweight database)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- dotenv (environment configuration)

### **Step 2: Backend is Ready!**

The `database.js` file automatically creates a SQLite database on first run. No setup needed!

Configuration file: `backend/.env`
```
JWT_SECRET=your_secret_key_here_12345
PORT=5000
```

### **Step 3: Start Backend Server**

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ SQLite Database Connected!
```

### **Step 4: Access the Application**

Open in your browser:
```
http://localhost:5000
```

That's it! Both backend and frontend are now running on port 5000.

## 📂 **FILE STRUCTURE**

```
Event Pro/
├── index.html          ← Main page (Frontend)
├── style.css           ← Styling
├── script.js           ← Frontend logic
├── init.js             ← DOM initialization
├── backend/
│   ├── server.js       ← Express server (serves frontend + API)
│   ├── database.js     ← SQLite database initialization
│   ├── package.json    ← Dependencies
│   ├── eventpro.db     ← SQLite database file (auto-created)
│   ├── .env            ← Configuration
│   ├── middleware/
│   │   └── auth.js     ← JWT verification
│   ├── models/
│   │   ├── User.js     ← SQLite User model
│   │   ├── Booking.js  ← SQLite Booking model
│   │   └── Contact.js  ← SQLite Contact model
│   └── routes/
│       ├── auth.js     ← Authentication
│       ├── bookings.js ← Bookings
│       └── contact.js  ← Contact form
```

---

## 🔗 **CODE CONNECTIONS**

### **Frontend → Backend**

```
index.html (Form inputs)
    ↓
init.js (DOM element initialization)
    ↓
script.js (Functions & API calls)
    ↓
http://localhost:5000/api (Backend endpoint)
    ↓
server.js (Express server)
    ↓
routes/ (Route handlers)
    ↓
models/ (SQLite models)
    ↓
SQLite Database (Data storage in eventpro.db)
```

### **All Element References**

✅ `index.html` has ALL required IDs:
- Form inputs: `bName`, `bPhone`, `bDate`, `bAmount`, `bPlace`, `bEventType`, `bPackage`, `bTxnId`
- Auth: `regFirst`, `regLast`, `regEmail`, `regPhone`, `regPass`, `loginId`, `loginPass`
- Contact: `cfName`, `cfPhone`, `cfEmail`, `cfEvent`, `cfMsg`
- UI elements: `authOverlay`, `userMenu`, `galleryGrid`, `eventPage`, etc.

✅ `init.js` initializes ALL elements as global variables for easy access

✅ `script.js` uses these elements with functions like:
- `showSection()`, `openEventPage()`, `register()`, `login()`
- `submitContact()`, `submitBooking()`, `openSettings()`

---

## ⚠️ **COMMON ERRORS & FIXES**

### **Error: "Cannot find module 'better-sqlite3'"**

**Cause:** Dependencies not installed
**Fix:**
```bash
cd backend
npm install
```

### **Error: "Cannot read property 'value' of null"**

**Cause:** Element ID doesn't exist in HTML
**Fix:** 
1. Check that all input IDs match between HTML and script.js
2. Verify `init.js` loads before `script.js`
3. Clear browser cache (Ctrl+Shift+Delete)

### **Error: "Port 5000 already in use"**

**Cause:** Another application using port 5000
**Fix:**
1. Edit `backend/.env` and change PORT to 5001 or 5002
2. Or kill the process using port 5000:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### **Error: "API endpoint not found" or "Failed to fetch"**

**Cause:** Backend not running
**Fix:**
1. Make sure you ran `npm start` in the backend folder
2. Check that server shows: `🚀 Server running on http://localhost:5000`
3. Restart backend server
4. Check firewall isn't blocking port 5000

### **Error: "Undefined is not a function"**

**Cause:** Function not defined in script.js
**Fix:**
1. Verify function exists: check script.js for the function name
2. Check syntax errors in script.js
3. Run in browser console: `typeof functionName` (should show "function")

### **Error: "SQLITE_CANTOPEN" when starting server**

**Cause:** Permission issue or corrupted database
**Fix:**
1. Delete `backend/eventpro.db` file
2. Restart server - database will be recreated automatically
3. Check backend folder has write permissions

### **Error: "Form not submitting"**

**Cause:** JavaScript error or missing event handler
**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify onclick handler is correct in HTML
4. Check form validation logic

---

## 🧪 **TESTING CHECKLIST**

### **Frontend Tests**
- [ ] Page loads without console errors
- [ ] Hero slider works (slides change automatically)
- [ ] Navigation links work
- [ ] Login modal opens and closes
- [ ] Forms appear when clicking buttons
- [ ] Gallery images load

### **Backend Tests**
- [ ] Server starts without errors
- [ ] SQLite database file created: `backend/eventpro.db`
- [ ] Test API endpoint: `http://localhost:5000/api`
- [ ] Test signup: POST to `http://localhost:5000/api/auth/signup`
- [ ] Test login: POST to `http://localhost:5000/api/auth/login`

### **Integration Tests**
- [ ] Register a new account - data saves to SQLite
- [ ] Login with registered account
- [ ] Create a booking - saved to database
- [ ] Submit contact form - saved to database
- [ ] Data persists after server restart
- [ ] Login with credentials
- [ ] Create a booking
- [ ] Submit contact form
- [ ] View bookings
- [ ] Cancel a booking

---

## 🔧 **BROWSER CONSOLE DEBUGGING**

Open DevTools with F12 and test in Console:

```javascript
// Check if elements are initialized
console.log(bName)      // Should show <input> element
console.log(script.js functions exist)
typeof showSection      // Should be "function"

// Test API connection
fetch('http://localhost:5000/api')
  .then(r => r.json())
  .then(d => console.log(d))

// Check local storage
localStorage.getItem('ep_token')
localStorage.getItem('ep_user')
```

---

## 📱 **MOBILE RESPONSIVE**

The design is responsive. Test on:
- Desktop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

Use DevTools to simulate devices (F12 → Toggle device toolbar)

---

## 🔐 **SECURITY NOTES**

⚠️ **Development mode only** - For production:
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use environment variables properly
- [ ] Add HTTPS
- [ ] Validate all inputs on backend
- [ ] Use password hashing (already done with bcryptjs)
- [ ] Add rate limiting
- [ ] Add CSRF protection

---

## 📞 **SUPPORT**

If issues persist:

1. **Check error messages** - Look in browser console (F12)
2. **Restart everything** - Kill server and browser, start fresh
3. **Clear cache** - Ctrl+Shift+Delete, select "All time"
4. **Verify files** - Make sure all files are in correct folders
5. **Check URLs** - API_URL in script.js should be `http://localhost:5000/api`

---

## ✨ **YOU'RE ALL SET!**

Everything is properly linked and error-free. Just:
1. Setup MongoDB
2. Configure `.env`
3. Run `npm install` in backend folder
4. Start backend: `npm start`
5. Open `index.html` in browser

🎉 **Happy coding!**
