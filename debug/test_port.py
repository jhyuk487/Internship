import socket
import sys

def test_bind(port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('127.0.0.1', port))
        s.listen(1)
        s.close()
        print(f"Successfully bound to port {port}")
    except Exception as e:
        print(f"Failed to bind to port {port}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_bind(8000)
