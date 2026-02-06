from pymongo import MongoClient
import sys

def check_users():
    # Attempt to connect without auth first (common for local dev) or use the specific URI
    uri = "mongodb://localhost:27017/"
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=2000)
        
        # Check connection
        print(f"Connecting to {uri}...")
        client.admin.command('ping')
        print("Connected successfully.\n")

        # List users in 'teamB' database
        print("--- Users in 'teamB' database ---")
        try:
            db = client['teamB']
            users = db.command('usersInfo')
            user_list = users.get('users', [])
            if user_list:
                for user in user_list:
                    print(f"User: {user['user']}, Roles: {user['roles']}")
            else:
                print("No users found in 'teamB' database.")
        except Exception as e:
            print(f"Could not list users in 'teamB': {e}")

        # List users in 'admin' database (requires privilege)
        print("\n--- Users in 'admin' database ---")
        try:
            admin_db = client['admin']
            users = admin_db.command('usersInfo')
            user_list = users.get('users', [])
            if user_list:
                for user in user_list:
                    print(f"User: {user['user']}, Roles: {user['roles']}")
            else:
                print("No users found in 'admin' database.")
        except Exception as e:
            print(f"Could not list users in 'admin' (might need admin auth): {e}")

    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    check_users()
