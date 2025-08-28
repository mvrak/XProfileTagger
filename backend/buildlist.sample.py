import json
import requests

url = "https://sheets.googleapis.com/v4/spreadsheets/<spreadsheet ID>?alt=json&key=<API key>"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    values = data.get('values', [])

    result = {}

    for row in values:
        name = row[0]
        url = row[1]
        result[name] = url
    json_output = json.dumps(result, indent=4)

    print(json_output)

    with open('data/list.json', 'w') as f:
        f.write(json_output)
else:
    print(f"Failed to retrieve data: Status code {response.status_code}")

