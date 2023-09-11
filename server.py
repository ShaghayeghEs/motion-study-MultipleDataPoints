import json
from flask import Flask, request
from flask_cors import CORS
# Run this on terminal to enable CORS 'npm install CORS'           
app = Flask(__name__)
CORS(app)

@app.route('/store_data/', methods=['POST'])
def store_data():
    data = request.json
    print(data)

    # Save data to a JSON file
    with open('data.json', 'a') as f:
        json.dump(data, f)
        f.write('\n')

    return 'Success!', 200

if __name__ == "__main__":
    app.run(port=5000)
