# """
# Google Drive photo integration router
# Fetches image URLs from shared Google Drive folders
# """
# import logging
# from fastapi import APIRouter, HTTPException
# from googleapiclient.discovery import build
# from google.oauth2 import service_account
# import os
# import json

# logger = logging.getLogger(__name__)
# logger.setLevel("INFO")

# router = APIRouter(prefix="/api/photos", tags=["photos"])

# # Google Drive folder IDs extracted from shared links
# PHOTO_FOLDERS = {
#     "about": "1Fs2QCe0Kkb9dwCb2GzXMSaOWoldfsm7J",
#     "announcements": "1XtwtLGzTQsQcSDDqvkXdC2u15bWkZrtx",
#     "wheelock-house": "1tsQ7x147eSPN3zFhxo2cBj2xNPmkbdu8",
#     "wheelock-weekend": "1a7egsbkgPsvLHpSRUh6rg_YGsxE9g8i8"
# }

# def get_drive_service():
#     """
#     Create and return Google Drive API service
    
#     For LOCAL DEVELOPMENT:
#     1. Download JSON from Google Cloud Console (service account)
#     2. Save as backend/service_account.json
    
#     For RENDER PRODUCTION:
#     1. Copy the entire JSON content from service account key
#     2. In Render dashboard, add env var: GOOGLE_CREDENTIALS_JSON
#     3. Set value to the entire JSON (as single line or multiline)
#     """
#     try:
#         # Try to load from GOOGLE_CREDENTIALS_JSON environment variable (for Render)
#         credentials_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
#         if credentials_json:
#             credentials_dict = json.loads(credentials_json)
#             credentials = service_account.Credentials.from_service_account_info(
#                 credentials_dict,
#                 scopes=['https://www.googleapis.com/auth/drive.readonly']
#             )
#             logger.info(f"Loaded credentials from GOOGLE_CREDENTIALS_JSON env var. Service account: {credentials.service_account_email}")
#             return build('drive', 'v3', credentials=credentials)
#     except Exception as e:
#         logger.warning(f"Error loading from GOOGLE_CREDENTIALS_JSON: {e}")
    
#     # Fallback: Try to load from file (for local development)
#     try:
#         credentials = service_account.Credentials.from_service_account_file(
#             'service_account.json',
#             scopes=['https://www.googleapis.com/auth/drive.readonly']
#         )
#         logger.info(f"Loaded credentials from service_account.json file. Service account: {credentials.service_account_email}")
#         return build('drive', 'v3', credentials=credentials)
#     except FileNotFoundError:
#         logger.warning("service_account.json not found. Google Drive API will not be available.")
#         return None
#     except Exception as e:
#         logger.error(f"Error loading service account: {e}")
#         return None


# def get_images_from_folder(folder_id, service=None):
#     """Fetch all image files from a Google Drive folder"""
#     if not service:
#         service = get_drive_service()
    
#     if not service:
#         raise HTTPException(status_code=500, detail="Google Drive API not configured")
    
#     try:
#         # Query for image files (jpg, jpeg, png) in the folder
#         query = f"'{folder_id}' in parents and (mimeType='image/jpeg' or mimeType='image/png') and trashed=false"
#         results = service.files().list(
#             q=query,
#             spaces='drive',
#             fields='files(id, name)',
#             pageSize=100
#         ).execute()
        
#         files = results.get('files', [])
        
#         # Convert to viewable URLs
#         image_urls = []
#         for file in files:
#             # Direct download URL for images
#             url = f"https://drive.google.com/uc?export=view&id={file['id']}"
#             image_urls.append({
#                 "id": file['id'],
#                 "url": url
#             })
        
#         return image_urls
    
#     except Exception as e:
#         print(f"Error fetching images from folder {folder_id}: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching photos from Google Drive")


# @router.get("/{page}")
# async def get_photos(page: str):
#     """
#     Get photos for a specific page
    
#     Params:
#     - page: 'about', 'announcements', 'wheelock-house', or 'wheelock-weekend'
    
#     Returns:
#     {
#         "page": "about",
#         "images": [
#             {"id": "file_id", "url": "direct_drive_url"},
#             ...
#         ]
#     }
#     """
#     if page not in PHOTO_FOLDERS:
#         raise HTTPException(status_code=404, detail=f"Unknown page: {page}")
    
#     folder_id = PHOTO_FOLDERS[page]
#     images = get_images_from_folder(folder_id)
    
#     return {
#         "page": page,
#         "images": images
#     }


# # For local testing without Google credentials
# @router.get("/test/folders")
# async def test_folders():
#     """Returns the folder IDs (for testing folder structure)"""
#     return PHOTO_FOLDERS
