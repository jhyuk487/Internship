import requests
import json
import sys

def test_find_password():
    url = "http://127.0.0.1:8000/auth/find-password"
    
    # Test case 1: Valid user
    payload = {
        "user_id": "20240001",
        "email": "gildong@example.com"
    }
    
    print(f"Testing with valid user: {payload}")
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Found password: {data.get('password')}")
            if data.get('password') == "password123":
                print("Password matches expected value.")
            else:
                print(f"WARNING: Password {data.get('password')} does not match expected password123")
        else:
            print(f"FAILED: Status code {response.status_code}, Detail: {response.text}")
    except Exception as e:
        print(f"ERROR: Could not connect to backend: {e}")

    # Test case 2: Invalid email
    payload = {
        "user_id": "20240001",
        "email": "wrong@example.com"
    }
    print(f"\nTesting with invalid email: {payload}")
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 404:
            print("SUCCESS: Received 404 as expected for wrong email.")
        else:
            print(f"FAILED: Status code {response.status_code}, expected 404.")
    except Exception as e:
        print(f"ERROR: {e}")

    # Test case 3: Invalid student ID
    payload = {
        "user_id": "99999999",
        "email": "gildong@example.com"
    }
    print(f"\nTesting with invalid student ID: {payload}")
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 404:
            print("SUCCESS: Received 404 as expected for non-existent user.")
        else:
            print(f"FAILED: Status code {response.status_code}, expected 404.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_find_password()
