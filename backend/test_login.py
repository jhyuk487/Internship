import requests

def test_login():
    url = "http://127.0.0.1:8000/auth/login"
    # Using a sample ID from login_info.json
    payload = {
        "user_id": "5004273354",
        "user_password": "5004273354"
    }
    
    try:
        print(f"Testing login for {payload['user_id']}...")
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
