import json
from flask import Flask, request
from flask_cors import CORS
# Run this on terminal to enable CORS 'npm install CORS'           
app = Flask(__name__)
CORS(app, origins="http://127.0.0.1:5500")

@app.route('/store_data/', methods=['POST'])
def store_data():
    data = request.get_json()
    print("Received Payload:", data)  # Logging received payload for debugging

    # Performing a simplified check for required keys
    required_keys = ['participant_id', 'ratio', 'trial_number', 'time_spent', 'participant_answer', 'correct_answer', 'type_of_encoding']
    if not all(key in data for key in required_keys):
        print("Missing required keys")  # Logging the error for debugging
        return 'Bad Request: Missing required keys', 400
    

    # Saving the data to a file
    with open('data.json', 'a') as f:
        json.dump(data, f)
        f.write('\n')
    
    return 'Success!', 200
if __name__ == "__main__":
    app.run(port=5000)