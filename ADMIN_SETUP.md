# Admin Setup Instructions

## Overview
Admins log in through the `/admin` route on the website. Once logged in, they can view and edit all website content through the admin panel.

## How to Add Admin Credentials

### Option 1: Using cURL (Easiest for Quick Testing)

To create the first admin, use the registration endpoint:

```bash
# Create an admin account (replace username and password with your values)
curl -X POST https://wheelock-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_secure_password"
  }'
```

### Option 2: Using Python Script

Create a file called `create_admin.py` in your backend directory:

```python
import requests
import sys

def create_admin(username, password, backend_url="https://wheelock-backend.onrender.com"):
    """Create a new admin user"""
    try:
        response = requests.post(
            f"{backend_url}/api/auth/register",
            json={
                "username": username,
                "password": password
            }
        )
        
        if response.status_code == 200:
            print(f"✓ Admin '{username}' created successfully")
        elif response.status_code == 400:
            print(f"✗ Username '{username}' already exists")
        else:
            print(f"✗ Error: {response.json()}")
    except Exception as e:
        print(f"✗ Connection error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <username> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    create_admin(username, password)
```

Then run:
```bash
python create_admin.py myusername mypassword
```

### Option 3: Using Render's Database Access

1. Go to your Render dashboard → click your backend service
2. Click the "Database" tab
3. Click "Connect" and copy the connection string
4. Connect to the database using a tool like DBeaver or psql
5. Run this SQL:

```sql
-- Insert admin user (password hash for 'password123')
INSERT INTO admin (username, password_hash) 
VALUES (
  'admin_user',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVj2FSi'
);

-- Or for a custom password, you need to hash it first using bcrypt
-- This example shows the hash for 'password123'
```

## How to Login

1. Go to `https://wheelock-website.onrender.com/admin`
2. Enter your username and password
3. Click "Login"
4. You'll see the admin panel with options to edit all content

## Logging Out

Click the "Logout" button in the top-right of the admin panel. This will clear your session.

## Important Notes

- Passwords are hashed with bcrypt and never stored in plain text
- Admin tokens last for 24 hours
- If you forget credentials, use the cURL or Python method to create a new account with a different username
- Do NOT commit credentials to git. Share credentials securely through a password manager.
