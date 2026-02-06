import requests
try:
    r = requests.get("http://127.0.0.1:8000/health", timeout=5)
    print(f"Health: {r.status_code}")
except Exception as e:
    print(f"Failed: {e}")
