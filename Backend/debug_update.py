import urllib.request
import json
import urllib.error

url = "http://localhost:8080/api/courses/VerifyCourse_539884681"
data = {
  "name": "VerifyCourse_539884681",
  "title": "Test Title",
  "id": 16,
  "totalFee": 1000,
  "discount": 1002,
  "description": "Test Desc",
  "duration": "10 Weeks",
  "level": "Beginner",
  "domain": "Test",
  "slug": None,
  "iconName": None,
  "color": None,
  "bgColor": None,
  "borderColor": None,
  "gradient": None,
  "shadow": None
}
jsonData = json.dumps(data).encode('utf-8')

req = urllib.request.Request(url, data=jsonData, method='PUT')
req.add_header('Content-Type', 'application/json')

try:
    print(f"Sending PUT request to {url}")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print("Response Body:")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    error_content = e.read().decode('utf-8')
    print("Error Body:")
    print(error_content)
    with open("error.log", "w", encoding="utf-8") as f:
        f.write(error_content)
except Exception as e:
    print(f"Error: {e}")
    with open("error.log", "w", encoding="utf-8") as f:
        f.write(str(e))
