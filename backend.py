import os
from flask import Flask, redirect, render_template, request, url_for, Response
from pymongo import MongoClient

app = Flask(__name__)

# MONGO_URI = os.environ['mongo_uri']

# client = MongoClient(MONGO_URI)
# db = client.project
# users = db.users


@app.route('/')
def home():
	return "We're good"

# @app.route('/db')

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))
