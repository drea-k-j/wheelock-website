# Google Drive Photo Integration Setup Guide

## Overview
Your Wheelock Website now has automatic photo galleries that pull images directly from Google Drive folders. Images cycle every 5 seconds, and filenames are hidden from display.

## Photo Folders Setup ✅ DONE
You've already shared these folders with public "viewable" access:
- **About**: `1Fs2QCe0Kkb9dwCb2GzXMSaOWoldfsm7J`
- **Home/Announcements**: `1XtwtLGzTQsQcSDDqvkXdC2u15bWkZrtx`
- **Wheelock House**: `1tsQ7x147eSPN3zFhxo2cBj2xNPmkbdu8`
- **Wheelock Weekend**: `1a7egsbkgPsvLHpSRUh6rg_YGsxE9g8i8`

## Local Development Setup

### Step 1: Create Google Service Account (Free)
This allows your backend to access Google Drive programmatically.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a Project" → "New Project"
3. Name it "Wheelock Website" → Create
4. Enable Google Drive API:
   - Search "Google Drive API" → Click Enable
5. Create Service Account:
   - Go to "Service Accounts" (left menu)
   - Click "Create Service Account"
   - Name: "wheelock-bot" → Create and Continue
   - Grant role: **Editor** (allows reading files)
   - Click "Create Key" → Choose **JSON** → Download
6. Save the JSON file as `backend/service_account.json`

### Step 2: Share Folders with Service Account
The service account needs access to your Google Drive folders.

1. Copy the "client_email" from the JSON file (looks like: `wheelock-bot@project.iam.gserviceaccount.com`)
2. For each folder (About, Announcements, Wheelock House, Wheelock Weekend):
   - Open the folder in Google Drive
   - Click Share → Paste the client_email → Give **Viewer** access
   - Click Share

### Step 3: Install Dependencies
In your terminal, navigate to the `backend/` folder:

```bash
pip install -r requirements.txt
```

This installs the Google Drive API libraries.

### Step 4: Test Locally
Start your backend:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --ssl-keyfile ../certs/localhost-key.pem --ssl-certfile ../certs/localhost.pem
```

Test the photos endpoint:
```
https://localhost:8000/api/photos/about
```

You should see JSON with image URLs.

## Frontend Features

### Photo Gallery Component
Each page now has a `PhotoGallery` component that:
- ✅ Fetches photos from backend
- ✅ Cycles through images every 5 seconds
- ✅ Shows photo counter (e.g., "3 / 7")
- ✅ Hides filenames (shows progress instead)
- ✅ Navigation arrows appear on hover
- ✅ Click dots to jump to specific photo

Pages with galleries:
- **About page** - Shows About folder photos
- **Announcements/Home** - Shows Announcements folder photos
- **Wheelock House** - Shows Wheelock House folder photos
- **Wheelock Weekend** - Shows Wheelock Weekend folder photos

## Static Files: JPEG & PDF

### Campus Map JPEG (Wheelock Weekend page)
For the campus map image:

1. **On Render deployment**:
   - Create folder: `frontend/public/assets/`
   - Upload your `campus_map.jpeg` there
   - In code, it will be at: `/assets/campus_map.jpeg`

2. **In component** (WheelockWeekend.jsx):
   - Look for the TODO comment in the file
   - Add this in the "Campus Map" section:
   ```jsx
   <img src="/assets/campus_map.jpeg" alt="Campus Map" className="w-full rounded mt-4" />
   ```

### Residents Manual PDF (Residents page)
For the manual PDF:

1. **On Render deployment**:
   - Create folder: `frontend/public/assets/`
   - Upload your `residents_manual.pdf` there
   - In code, it will be at: `/assets/residents_manual.pdf`

2. **In component** (Residents.jsx):
   - Look for the TODO comment in the file
   - Add this in the "Manual" section:
   ```jsx
   <a href="/assets/residents_manual.pdf" download className="inline-block bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90 mt-2">
     Download Manual PDF
   </a>
   ```

## Deployment to Render

### Step 1: Prepare Credentials

You have TWO options:

**Option A: Upload Service Account File (Simpler)**
1. Commit `backend/service_account.json` to GitHub
2. Render will automatically find it
3. Backend queries Google Drive using the file

**Option B: Use Environment Variable (More Secure)**
1. DON'T commit the JSON file to GitHub
2. In Render Dashboard:
   - Go to Web Service → Environment
   - Add variable: `GOOGLE_CREDENTIALS_JSON`
   - Value: Paste the **entire JSON** content from service_account.json
3. Backend reads from the environment variable

### Step 2: Share Folders with Service Account (Again)
Make sure the service account email has access to all 4 folders with **Viewer** permission.

### Step 3: Deploy
1. Push your code to GitHub (with photos.py router and requirements.txt updated)
2. Render automatically rebuilds and deploys
3. Photos endpoints should work: `https://your-render-url.onrender.com/api/photos/about`

### Step 4: Test Images Load
In your frontend, images will be fetched from:
- `https://drive.google.com/uc?export=view&id=FILE_ID`

Google securely serves images from Drive.

### Step 5: Add Static Files (JPEG & PDF)

On Render, you need to include the static files in your deployment:

1. Create in **local** project: `frontend/public/assets/`
2. Add your files:
   - `campus_map.jpeg`
   - `residents_manual.pdf`
3. Commit to GitHub: `git add frontend/public/assets/`
4. Push to GitHub
5. Render redeploys and serves files from `/assets/`

**Note**: Only files committed to GitHub will be deployed to Render.

## Troubleshooting

### Photos not showing?
1. Check backend logs in Render Dashboard
2. Verify service account has **Viewer** access to folders
3. Ensure folder IDs are correct in `backend/routers/photos.py`
4. Test endpoint: `https://your-url/api/photos/about`

### JPEG/PDF not downloading?
1. Verify files are in `frontend/public/assets/`
2. Check that files are committed to GitHub
3. Verify file paths in component code match actual filenames
4. Test visiting: `https://your-url/assets/campus_map.jpeg`

### "Google Drive API not configured" error?
1. Check `GOOGLE_CREDENTIALS_JSON` environment variable is set (if using Option B)
2. Verify `service_account.json` exists in backend folder (if using Option A)
3. Regenerate credentials if needed

## File Structure
```
wheelock-website/
├── backend/
│   ├── routers/
│   │   └── photos.py          ← NEW: Google Drive integration
│   ├── service_account.json   ← Your Google credentials (keep secure)
│   └── requirements.txt        ← Updated with Google libraries
├── frontend/
│   ├── public/
│   │   └── assets/            ← NEW: Place JPEG & PDF here
│   │       ├── campus_map.jpeg
│   │       └── residents_manual.pdf
│   └── src/components/
│       ├── PhotoGallery.jsx   ← NEW: Photo cycling component
│       ├── About.jsx          ← Updated: Added PhotoGallery
│       ├── Announcements.jsx  ← Updated: Added PhotoGallery
│       ├── WheelockHouse.jsx  ← Updated: Added PhotoGallery
│       ├── WheelockWeekend.jsx ← Updated: Added PhotoGallery + JPEG comment
│       └── Residents.jsx      ← Updated: Added PDF comment
└── GOOGLE_DRIVE_SETUP.md      ← This file
```

## API Reference

### Backend Endpoint
```
GET /api/photos/{page}
```

**Parameters:**
- `page`: One of: `about`, `announcements`, `wheelock-house`, `wheelock-weekend`

**Response:**
```json
{
  "page": "about",
  "images": [
    {
      "id": "GOOGLE_FILE_ID",
      "url": "https://drive.google.com/uc?export=view&id=GOOGLE_FILE_ID"
    },
    ...
  ]
}
```

## Summary
✅ **4 Dynamic Photo Galleries** - Pull from Google Drive folders  
✅ **Auto-cycling** - Every 5 seconds  
✅ **Hidden Filenames** - Shows photo counter instead  
✅ **Simple Local Testing** - Works with service account  
✅ **Easy Render Deployment** - Just set environment variables  
✅ **Static Files** - JPEG and PDF ready to add  

You're all set! 🎉
