from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def hello_world():
    message = os.environ.get('CUSTOM_MESSAGE', 'Hello from Flask in Docker!')
    hostname = os.environ.get('HOSTNAME', 'Unknown')
    return f"<h1>{message}</h1><p>Served by container: {hostname}</p>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
