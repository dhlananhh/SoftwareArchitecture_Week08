from flask import Flask
import os
import socket

app = Flask(__name__)

@app.route('/')
def hello_world():
  hostname = socket.gethostname()
  return f'Hello from Flask instance: {hostname}!'

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
