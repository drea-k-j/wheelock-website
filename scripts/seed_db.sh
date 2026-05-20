#!/bin/bash
# Render deployment seed script
# This runs as a preDeployCommand to populate the database

echo "🌱 Seeding database..."

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set, skipping database seed"
    exit 0
fi

# Run the seed script
python seed_database.py

# Check if seeding was successful
if [ $? -eq 0 ]; then
    echo "✓ Database seed completed"
    exit 0
else
    echo "⚠️  Database seed completed with errors (non-fatal)"
    # Do fail deployment if seeding has issues
    exit $?
fi
