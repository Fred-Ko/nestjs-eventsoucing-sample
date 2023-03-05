import json

with open('.env', 'r') as f:
    # read .env file and create dictionary object
    data = {}
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            key, value = line.split('=', 1)
            data[key] = value

with open('.env.json', 'w') as f:
    # write dictionary object to env.json file
    json.dump(data, f, indent=2)
