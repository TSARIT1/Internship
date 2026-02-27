import urllib.request
import json

api_key = "AIzaSyAo1DJBV5HGlXEomUbfVASbD_JsdSzrPm8"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    with urllib.request.urlopen(url) as response:
        if response.status == 200:
            data = json.loads(response.read().decode())
            models = data.get('models', [])
            with open('D:/Desktop/NewWebsite/New Web/Backend/models_list.txt', 'w', encoding='utf-8') as f:
                for m in models:
                    name = m['name']
                    if 'flash' in name.lower() or 'pro' in name.lower():
                         f.write(f"{name}\n")
            print("Wrote models to models_list.txt")
        else:
            print(f"Error: {response.status}")
except Exception as e:
    print(f"Exception: {e}")
