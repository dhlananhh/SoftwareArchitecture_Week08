from flask import Flask, request, jsonify
import redis
import os

app = Flask(__name__)
redis_host = os.environ.get('REDIS_HOST', 'redis')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)

@app.route('/vote', methods=['POST'])
def vote():
    data = request.get_json()
    if 'option' not in data:
        return jsonify({'message': 'Option is required'}), 400
    option = data['option']
    redis_client.incr(option)
    return jsonify({'message': 'Vote submitted'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
