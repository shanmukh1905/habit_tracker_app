import json
import os
from pymongo import MongoClient
import sys

# File paths for JSON data
HABITS_FILE = 'data/habits.json'
COMPLETIONS_FILE = 'data/completions.json'

def migrate_data_to_mongodb(connection_string='mongodb://localhost:27017/'):
    """
    Migrate data from JSON files to MongoDB.
    
    Args:
        connection_string: MongoDB connection string
    """
    try:
        # Connect to MongoDB
        client = MongoClient(connection_string)
        
        # Create database (if it doesn't exist)
        db = client.habit_tracker
        
        # Create collections (if they don't exist)
        habits_collection = db.habits
        completions_collection = db.completions
        
        # Check if collections already have data
        if habits_collection.count_documents({}) > 0 or completions_collection.count_documents({}) > 0:
            user_input = input("Collections already contain data. Do you want to proceed and potentially create duplicates? (y/n): ")
            if user_input.lower() != 'y':
                print("Migration aborted.")
                return
        
        # Check if data files exist
        if not os.path.exists(HABITS_FILE) or not os.path.exists(COMPLETIONS_FILE):
            print(f"Error: JSON files not found at {HABITS_FILE} or {COMPLETIONS_FILE}")
            return
        
        # Load data from JSON files
        with open(HABITS_FILE, 'r') as f:
            habits = json.load(f)
        
        with open(COMPLETIONS_FILE, 'r') as f:
            completions = json.load(f)
        
        # Insert habits into MongoDB
        if habits:
            print(f"Migrating {len(habits)} habits...")
            for habit in habits:
                # Check if habit already exists
                existing = habits_collection.find_one({"id": habit["id"]})
                if not existing:
                    habits_collection.insert_one(habit)
        else:
            print("No habits to migrate.")
        
        # Insert completions into MongoDB
        if completions:
            print(f"Migrating completions for {len(completions)} habits...")
            for habit_id, dates in completions.items():
                # Check if completion already exists
                existing = completions_collection.find_one({"habit_id": habit_id})
                if existing:
                    # Update existing document
                    completions_collection.update_one(
                        {"habit_id": habit_id},
                        {"$set": {"dates": dates}}
                    )
                else:
                    # Create new document
                    completions_collection.insert_one({
                        "habit_id": habit_id,
                        "dates": dates
                    })
        else:
            print("No completions to migrate.")
        
        print("Migration completed successfully!")
        
        # Print some stats
        print(f"Total habits in MongoDB: {habits_collection.count_documents({})}")
        print(f"Total completion records in MongoDB: {completions_collection.count_documents({})}")
        
    except Exception as e:
        print(f"Error during migration: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    # Get connection string from command line if provided
    connection_string = sys.argv[1] if len(sys.argv) > 1 else 'mongodb://localhost:27017/'
    migrate_data_to_mongodb(connection_string)
