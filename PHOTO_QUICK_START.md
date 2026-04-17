# Quick Start: Photo Integration

## ✨ What's Ready
- ✅ Photo galleries on: About, Announcements, Wheelock House, Wheelock Weekend
- ✅ Auto-cycling (5 seconds)
- ✅ Hidden filenames (clean display)
- ✅ Backend Google Drive API integration
- ✅ Frontend PhotoGallery component created
- ✅ Static assets folder ready for JPEG & PDF

## 🚀 Quick Setup (3 Steps)

### 1️⃣ Create Google Service Account (5 min)
```
1. Go to https://console.cloud.google.com
2. Create new project → Enable Google Drive API
3. Create Service Account → Save JSON key as backend/service_account.json
4. Copy the client_email from JSON
```

### 2️⃣ Share Folders with Service Account (2 min)
```
For each of your 4 Google Drive folders:
1. Open folder → Click Share
2. Paste client_email → Give "Viewer" permission
3. Done!
```

### 3️⃣ Test & Deploy
```bash
# Local test:
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000 --ssl-keyfile ../certs/localhost-key.pem --ssl-certfile ../certs/localhost.pem

# Visit: http://localhost:5173
# See photos cycling on each page!
```

## 📂 File Locations

| Component | Location | Purpose |
|-----------|----------|---------|
| PhotoGallery.jsx | `frontend/src/components/` | Display photos (NEW) |
| photos.py | `backend/routers/` | Fetch from Google Drive (NEW) |
| service_account.json | `backend/` | Google credentials (TO CREATE) |
| campus_map.jpeg | `frontend/public/assets/` | Map image (TO ADD) |
| residents_manual.pdf | `frontend/public/assets/` | Manual PDF (TO ADD) |

## 🔗 Folder IDs (Already Configured)
```
About: 1Fs2QCe0Kkb9dwCb2GzXMSaOWoldfsm7J
Announcements: 1XtwtLGzTQsQcSDDqvkXdC2u15bWkZrtx
Wheelock House: 1tsQ7x147eSPN3zFhxo2cBj2xNPmkbdu8
Wheelock Weekend: 1a7egsbkgPsvLHpSRUh6rg_YGsxE9g8i8
```

## 🎯 For Campus Map & Manual

**In WheelockWeekend.jsx** (look for TODO):
```jsx
<img src="/assets/campus_map.jpeg" alt="Campus Map" className="w-full rounded mt-4" />
```

**In Residents.jsx** (look for TODO):
```jsx
<a href="/assets/residents_manual.pdf" download>Download Manual PDF</a>
```

## ❓ Need Help?
See **GOOGLE_DRIVE_SETUP.md** for detailed instructions.

---
**Status**: Ready for local testing ✓ | Ready for Render deployment ✓
