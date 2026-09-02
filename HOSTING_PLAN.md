# Wheelock Website Deployment Plan

## Overview
The Wheelock Website will be hosted on **Render.com** as a unified hosting service. All components (frontend, backend, database) will be managed through a single provider.

## Why Render.com?

- Hosts both React frontend AND Python/FastAPI backend
- Includes free PostgreSQL database
- Admin-friendly dashboard (suitable for non-technical users)
- Easy GitHub integration for automatic deployments
- Reasonable pricing with free tier options
- Supports environment variables and secure configuration

## Architecture

### Frontend
- **Platform**: Render.com Static Site
- **Framework**: React + Vite
- **Deployment**: Automatic via GitHub push to main branch
- **Features**: 
  - Responsive design (mobile/tablet/desktop)
  - Client-side routing
  - API calls to backend at `/api/*`

### Backend
- **Platform**: Render.com Web Service (Python)
- **Framework**: FastAPI
- **Port**: 8000
- **Features**:
  - RESTful API endpoints
  - Database connection to PostgreSQL
  - CORS enabled for frontend domain
  - Admin authentication for protected routes
  - Secure JWT token generation with SECRET_KEY

### Database
- **Platform**: Render.com PostgreSQL
- **Type**: PostgreSQL relational database
- **Purpose**: 
  - Store content for About sections
  - Store Wheelock House sections
  - Store Announcements
  - Store admin users (future)

### Photos & Media
- **Primary Storage**: Google Drive
- **Access Method**: 
  - Google Drive API (recommended for admin control)
  - OR public shared links (simpler, less control)
- **Integration**: 
  - Backend fetches file list from Google Drive
  - Frontend receives image URLs from backend
  - Updates frequency: Monthly (admin uploads/retires images)

### Forms & Newsletters
- **Google Forms**: For registrations, applications, sign-ups
- **Google Sheets**: Optional for data collection
- **Constant Contact** (optional): Newsletter management and auto-sync
- **Archive**: Stored in database with manual or auto-sync integration

## Deployment Steps

1. **Prepare Repository**
   - Both frontend and backend in same GitHub repo
   - Include `.render-build.sh` for build scripts
   - Add `requirements.txt` for Python dependencies

2. **Create Render Services**
   - Create PostgreSQL database
   - Create Web Service for backend (Python)
   - Create Static Site for frontend (React build)

3. **Configure Environment Variables**
   - Backend: Database URL, API keys, CORS origin
   - Frontend: API base URL (backend URL)

4. **Set Up GitHub Integration**
   - Connect GitHub repo to Render
   - Enable auto-deploys on push to main branch

5. **Google Drive API Setup** (if using)
   - Create Google Cloud project
   - Enable Drive API
   - Generate service account key
   - Store credentials in environment variables

## Security: SECRET_KEY Management

**What is SECRET_KEY?**
- SECRET_KEY is used by FastAPI to sign JWT (JSON Web Tokens) for admin authentication
- It's a cryptographic key that ensures tokens cannot be forged or modified
- Never hardcode or commit SECRET_KEY to version control

**For Local Development:**
```bash
# Create a .env file in the backend folder
echo "SECRET_KEY=dev-secret-key-change-in-production" > backend/.env
```

**For Production (Render.com):**
1. Generate a strong random key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
2. In Render.com dashboard:
   - Go to your Web Service > Environment
   - Add environment variable:
     - **Key**: `SECRET_KEY`
     - **Value**: (paste the generated random key)
3. FastAPI will automatically read from environment variables via `os.getenv("SECRET_KEY")`

**For Other Platforms (Vercel, AWS, etc.):**
- Vercel: Add to project settings > Environment Variables
- AWS Lambda: Store in AWS Secrets Manager or Parameter Store
- Heroku: `heroku config:set SECRET_KEY=your-random-key`

**Security Best Practices:**
- Use a different SECRET_KEY for each environment (dev, staging, prod)
- Regenerate SECRET_KEY if you suspect compromise
- Never share SECRET_KEY with team members directly; use environment management tools
- Rotate SECRET_KEY periodically in production

## Cost Estimates

- **PostgreSQL**: Free tier (1GB, no auto-backup) or $15/month (includes backups)
- **Backend Web Service**: Free tier or $12/month for reliable uptime
- **Frontend Static Site**: Free tier
- **Total**: $0-$27/month depending on tier

## Admin Dashboard Access

Admins can access:
- Render.com dashboard to monitor services
- Built-in admin panel in the website (future feature)
- Google Drive directly for photo management


## Timeline

1. Set up GitHub repository with proper structure
2. Configure Render services and database
3. Deploy backend to Render
4. Deploy frontend to Render
5. Test full integration
6. Implement Google Drive integration
7. Go live

## Security Considerations

- All secrets stored as Render environment variables (not in code)
- Database credentials never exposed to frontend
- CORS configured to accept requests only from deployed frontend
- Admin authentication implemented for protected routes
- Google API keys stored securely

## Next Steps

1. Create GitHub repository structure for Render deployment
2. Add deployment configuration files
3. Set up Google Cloud project for Drive API (optional)
4. Create Render account and services
5. Configure continuous deployment
