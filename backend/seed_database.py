"""
Database seeding script for Wheelock Website
Populates PostgreSQL with initial content for all sections

Usage (local):
    DATABASE_URL="postgresql://user:pass@localhost/dbname" python seed_database.py

Usage (Render):
    Seeding runs automatically on app startup
"""

import psycopg
from psycopg import sql
import os
import sys
from urllib.parse import urlparse


def seed_database(database_url, content_data=None):
    """
    Seed the database with initial content (idempotent - only seeds if empty)
    
    Args:
        database_url (str): Database connection URL
        content_data (dict): Optional content to insert. If None, uses defaults.
    
    Returns:
        bool: True if seeding succeeded or was skipped (database already has content)
    """
    
    if not database_url:
        print("✗ Error: DATABASE_URL not provided")
        return False
    
    # Use default content if not provided
    if content_data is None:
        content_data = {
            'about_sections': [
                ('About', 'The Wheelock Society is Dartmouth\'s ecumenical Christian alumni network. We support student-led initiatives that foster the integration of faith, reason, vocation, and service at the College.'),
                ('History', '''<ul>
<li><strong>2006:</strong> Students found <a href="https://dartmouthapologia.org">the <em>Apologia</em>, Dartmouth\'s undergraduate journal of Christian thought</a>.</li>
<li><strong>2009:</strong> Alumni found the Wheelock Society to partner with <em>Apologia</em> and catalyze similar initiatives.</li>
<li><strong>2010:</strong> Inaugural Wheelock Conference—now Wheelock Weekend. Launch of the Waterman Institute—now Vox Veritatis—Dartmouth\'s student affiliate for both <a href="https://www.veritas.org">the Veritas Forum</a> and <a href="https://thomisticinstitute.org">the Thomistic Institute</a>.</li>
<li><strong>2015:</strong> Wheelock House purchased.</li>
<li><strong>2022:</strong> Wheelock House opens for residents.</li>
<li><strong>2025:</strong> Wheelock House opens to the public.</li>
</ul>'''),
                ('Leadership', '''Charlie Clark \'11, Executive Director (charlie@wheelocksociety.org)
Bruce McKenzie \'81, Chairman
Gregg Fairbrothers \'76
Anne McCune \'79
Beth Johnston Stephenson \'82
Louis Tucker \'95
Adrian Ng \'05
Andrew Schuman \'10
Hilary Johnson \'15
Nathaniel Schmucker \'15
Sara Holston \'17
Nico Allison \'28
Lauren Yoon \'28
Clara Yuo \'29
Prof. Lindsay Whaley'''),
            ],
            'wheelock_weekend': [
                ('Wheelock Weekend', 'Thank you for coming to Wheelock Weekend 2026!\n\nThe Wheelock Weekend takes place every April. Christian alumni return to Hanover for three days of fellowship with current students and one another. Photos from past events are available in our gallery.'),
                ('Date & Registration', '<a href="https://docs.google.com/forms/d/e/1FAIpQLSffZGeMI-imbABd0QWK6Be1DEDxd_w9cFE5xFcoBcivXLRDAw/viewform?usp=header">Register for Wheelock Weekend</a>'),
                ('Schedule', 'Full schedule coming soon. Please refer to <a href="https://maps.google.com">campus map</a> for event locations and directions.'),
                ('Speaker Bios', 'Speaker bios and headshots coming soon.'),
                ('Campus Map', '<a href="https://drive.google.com/file/d/1X1zse-oQVrGseYz0NkrsR6ZWLHSI_o2y/view?usp=share_link">View Campus Map</a>'),
            ],
            'wheelock_house': [
                ('Wheelock House', 'The Wheelock House is Dartmouth\'s Christian living learning community and study center. Built in 1773 as the personal home of Dartmouth\'s founding president, Eleazar Wheelock, it now serves as an intentional Christian community. Photos and more information available in our gallery.'),
                ('About', 'Built in 1773 as the personal home of Dartmouth\'s founding president, Eleazar Wheelock, the Wheelock House is a Christian intentional community with 24 residential members. Residents attend weekly dinner discussions with Christian faculty and alumni, participate in spiritual retreats, and inhabit formative rhythms of work and prayer. The ground-floor study center at the House includes a lecture hall, library, seminar room, and café, all open to the public and offering numerous hospitality opportunities throughout the week.'),
                ('Reservations', '<p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdAT6EVv761wOPRQ0eK4amheye-onepnT0NzXX4lnzMnG9ACw/viewform?usp=header">Request to reserve a public space at the Wheelock House</a> (Check the calendar below for availability.)</p><p>Google Calendar: <iframe src="https://calendar.google.com/calendar/embed?src=d2hlZWxvY2tzb2NpZXR5QGdtYWlsLmNvbQ" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe></p>'),
                ('Apply', '<a href="https://drive.google.com/file/d/1X1zse-oQVrGseYz0NkrsR6ZWLHSI_o2y/view?usp=share_link">Apply to live at the Wheelock House</a>'),
                ('Learn More', '<a href="https://cscmovement.org">Learn more about the Christian study center movement</a>'),
            ],
            'residents': [
                ('Manual', '<a href="/assets/residents-manual.pdf">Residents\' Manual</a>'),
                ('Key Dates', '''Summer 26S (Spring 2026)
Move-in: March 19
Move-out: June 15

Summer 26X (Summer 2026)
Move-in: June 16
Move-out: September 2

Fall 2026
Move-in: September 5
Move-out: November 25'''),
            ],
            'newsletters': [
                ('Sign-up', '<p>Sign up for our newsletter to receive updates about Wheelock House events, speakers, and opportunities.</p><p><a href="https://lp.constantcontactpages.com/su/apx8wmX/monthly">Subscribe to Monthly Updates</a></p><p><a href="https://lp.constantcontactpages.com/sl/K7WxNQv/quarterly">Subscribe to Quarterly Updates</a></p>'),
            ],
        }
    
    try:
        # Parse the database URL
        parsed = urlparse(database_url)
        
        # Connect to the database
        conn = psycopg.connect(
            host=parsed.hostname,
            port=parsed.port or 5432,
            dbname=parsed.path[1:],
            user=parsed.username,
            password=parsed.password,
            sslmode='require' if 'render.com' in (parsed.hostname or '') else 'prefer'
        )
        
        cursor = conn.cursor()
        
        # Check if database already has content (idempotency check)
        cursor.execute("SELECT COUNT(*) FROM about_sections")
        existing_rows = cursor.fetchone()[0]
        
        if existing_rows > 0:
            print("✓ Database already populated with content (skipping seed)")
            conn.close()
            return True
        
        # Insert content into each table
        for table, data in content_data.items():
            if table == 'announcements':
                # Special handling for announcements (has title, content, is_featured)
                for row in data:
                    cursor.execute(
                        f"INSERT INTO {table} (title, content, is_featured) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
                        row
                    )
            else:
                # For section tables (subsection, content)
                for row in data:
                    cursor.execute(
                        f"INSERT INTO {table} (subsection, content) VALUES (%s, %s) ON CONFLICT (subsection) DO UPDATE SET content = EXCLUDED.content",
                        row
                    )
            
            print(f"✓ Inserted {len(data)} rows into {table}")
        
        conn.commit()
        conn.close()
        print("\n✓ Database seeded successfully!")
        return True
        
    except psycopg.OperationalError as e:
        print(f"✗ Connection error: {e}")
        print("  Check that DATABASE_URL is correct and the database is accessible")
        return False
    except psycopg.DatabaseError as e:
        print(f"✗ Database error: {e}")
        if conn:
            conn.rollback()
            conn.close()
        return False
    except Exception as e:
        print(f"✗ Error seeding database: {e}")
        if conn:
            try:
                conn.rollback()
                conn.close()
            except:
                pass
        return False


if __name__ == "__main__":
    print("🌱 [Seed Script] Starting database seed process...")
    
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")
    
    # Try Render-specific variable name as fallback
    if not database_url:
        database_url = os.getenv("DATABASE_CONNECTION_URL")
    
    if not database_url:
        print("✗ Error: DATABASE_URL environment variable not set")
        print("\nUsage:")
        print("  DATABASE_URL='your_db_url' python seed_database.py")
        sys.exit(1)
    
    print(f"✓ [Seed Script] DATABASE_URL found (connecting to {database_url.split('@')[1] if '@' in database_url else 'database'}...)")
    
    success = seed_database(database_url)
    
    if success:
        print("✓ [Seed Script] Seed process completed successfully")
        sys.exit(0)
    else:
        print("✗ [Seed Script] Seed process failed")
        sys.exit(1)
