# Database Setup Instructions

## Getting Content into PostgreSQL Before Production Deploy

There are several ways to populate your Render PostgreSQL database with content before fully going live.

### Option 1: Using the Admin Panel (Recommended for Small Content)

Once you have admin credentials set up:

1. Go to `https://wheelock-website.onrender.com/admin`
2. Log in with your admin credentials
3. Navigate through each section (About, Wheelock House, etc.)
4. Click "Edit" on each subsection and add your content
5. Click "Save"

This is the easiest method for small updates and is the intended workflow.

### Option 2: Using SQL Directly (For Bulk Data)

#### Prerequisites
- Get your PostgreSQL connection string from Render dashboard
- Install a database client like DBeaver, Adminer, or use psql command-line

#### Steps

1. **Connect to your database:**
   - Render Dashboard → Your Database Instance → "Connect" button
   - Copy the connection string and use it with your preferred database client

2. **Insert content sections:**

```sql
-- First, check existing content
SELECT * FROM about;

-- Insert or update About sections
INSERT INTO about (subsection, content) 
VALUES 
  ('About', 'Your about page content here...'),
  ('History', 'Your history content here...'),
  ('Leadership', 'Your leadership content here...')
ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content;

-- Insert Wheelock House content
INSERT INTO wheelock_house (subsection, content)
VALUES 
  ('Wheelock House', 'Your wheelock house content...'),
  ('About', 'About the house...'),
  ('Apply', 'How to apply...'),
  ('Reservations', 'Reservation information...')
ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content;

-- Insert Wheelock Weekend content
INSERT INTO wheelock_weekend (subsection, content)
VALUES 
  ('Wheelock Weekend', 'Event description...'),
  ('Schedule', 'Schedule information...'),
  ('Bios', 'Speaker bios...'),
  ('Campus Map', 'Map content or HTML...'),
  ('Registration', 'Registration info...')
ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content;

-- Insert Residents content
INSERT INTO residents (subsection, content)
VALUES 
  ('Manual', 'Residents manual...'),
  ('Application', 'Application details...'),
  ('Key Dates', 'Important dates...')
ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content;

-- Insert Newsletter content
INSERT INTO newsletters (subsection, content)
VALUES 
  ('Sign-up', 'Newsletter signup information...')
ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content;

-- Insert announcements (if you have any)
INSERT INTO announcement (title, content, is_featured)
VALUES 
  ('Welcome', 'Welcome message', true),
  ('Upcoming Event', 'Event details', false)
ON CONFLICT DO NOTHING;
```

### Option 3: Using a Python Script (For Programmatic Bulk Loading)

Create a file called `seed_database.py`:

```python
import psycopg2
from psycopg2.extras import execute_values
import os
from urllib.parse import urlparse

def seed_database(database_url):
    """Seed the database with initial content"""
    
    # Parse the database URL
    parsed = urlparse(database_url)
    
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port,
        database=parsed.path[1:],
        user=parsed.username,
        password=parsed.password,
        sslmode='require'
    )
    
    cursor = conn.cursor()
    
    # Content to insert
    content_data = {
        'about': [
            ('About', 'Welcome to the About section...'),
            ('History', 'Our organization was founded...'),
            ('Leadership', 'Our leadership team includes...'),
        ],
        'wheelock_house': [
            ('Wheelock House', 'Wheelock House is...'),
            ('About', 'Learn about the house...'),
            ('Apply', 'Application process...'),
            ('Reservations', 'Book the house here...'),
        ],
        'wheelock_weekend': [
            ('Wheelock Weekend', 'Annual celebration event...'),
            ('Schedule', 'Friday to Sunday agenda...'),
            ('Bios', 'Speaker information...'),
            ('Campus Map', 'Event location map...'),
            ('Registration', 'Register for the weekend...'),
        ],
        'residents': [
            ('Manual', 'Residents handbook...'),
            ('Application', 'Application requirements...'),
            ('Key Dates', '2024 Important dates...'),
        ],
        'newsletters': [
            ('Sign-up', 'Join our mailing list...'),
        ],
    }
    
    try:
        # Insert content
        for table, data in content_data.items():
            query = f"INSERT INTO {table} (subsection, content) VALUES %s ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content"
            execute_values(cursor, query, data)
        
        conn.commit()
        print("✓ Database seeded successfully")
        
    except Exception as e:
        conn.rollback()
        print(f"✗ Error seeding database: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL environment variable not set")
        exit(1)
    
    seed_database(database_url)
```

Run it with:
```bash
DATABASE_URL="your_database_url" python seed_database.py
```

Or on Render, add it to your deployment:

1. Create `scripts/seed_db.sh`:
```bash
#!/bin/bash
python seed_database.py
```

2. Add to `render.yaml` backend service:
```yaml
preDeployCommand: "python seed_database.py"
```

### Option 4: Using Adminer (Web-Based)

1. Deploy a temporary Adminer instance for easy database management
2. This gives you a web interface to browse and edit database tables directly

## Checking What's in the Database

Run this SQL to see what content is stored:

```sql
-- View all About sections
SELECT subsection, LEFT(content, 50) as preview FROM about;

-- View all announcements
SELECT title, created_at FROM announcement ORDER BY created_at DESC;

-- View all tables
\dt  -- if using psql

-- Check if any content exists
SELECT COUNT(*) as total_content FROM about;
```

## Best Practices

1. **Test Locally First**: Populate your local SQLite database with content and test thoroughly before deploying
2. **Backup Before Bulk Changes**: Always back up your production database before running bulk SQL updates
3. **Use the Admin Panel for Regular Updates**: The admin panel is the intended way to update content day-to-day
4. **Version Control**: Keep your seed scripts in git (with sensitive data like passwords excluded)

## Troubleshooting

- **"Connection refused"**: Make sure your PostgreSQL instance is running on Render
- **"Permission denied"**: Check that your user has the right permissions on the tables
- **"Table does not exist"**: Run the migrations to create tables: `alembic upgrade head` (if using Alembic)
