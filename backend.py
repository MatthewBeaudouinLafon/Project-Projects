import os
from flask import Flask, redirect, render_template, request, url_for, Response
from pymongo import MongoClient
import pymongo
import csv
import urllib.request
import pprint
import re
import json
from bson import ObjectId
from selenium import webdriver
from depot.manager import DepotManager
from imgurpython import ImgurClient
import os

# from database_functions import fill_database, empty_database

from private_database_functions import fill_database, empty_database

print("Connecting to Database... Pending")
client = MongoClient('localhost', 27017)
db = client.test
posts = db.posts
print("Connecting to Database... Success!")

app = Flask(__name__)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@app.route('/')
def home():
    return "We're good"


@app.route('/api/all_projects')
def retrieve_all_project():
    print("Getting all projects")
    REGEX = ".*"
    search_item = re.compile(REGEX, re.IGNORECASE)
    project_information = list(db.posts.find({"title" : search_item}))
    output = JSONEncoder().encode(project_information)
    return output


@app.route('/api/project/<project_id>', methods=["POST"]) 
def save_project(project_id):
    if request.method == "POST":
        print("Setting project #{}".format(project_id))
        data = request.get_json(force=True)
        print(data)
        update_database(data, ObjectId(project_id))
    return "whatever"
    # Could be dangerous to use Mongo ID here??????


@app.route('/api/project/<project_id>', methods=["GET"]) 
def send_project(project_id):
    if request.method == "GET":
        print("Getting project #{}".format(project_id))
        return retrieve_JSON_Object(project_id)
    # Could be dangerous to use Mongo ID here??????


@app.route('/api/new_project/', methods=["GET"])
def new_project():
    if request.method == "GET":
        project = {}
        project["title"] = "Project Name"
        project["class"] = ""
        project["semester"] = ""
        project["members"] = []
        project["description"] = "This might be a good place to describe your project."
        project["chunk_list"] = []
        result = db.posts.insert_one(project).inserted_id
        print("Creating new project with id: {}".format(str(result)))
        return JSONEncoder().encode(str(result))


@app.route('/api/new_project/<project_title>', methods=["GET"])
def new_project_name(project_title):
    if request.method == "GET":
        print("New project called {}".format(project_title))
        project = {}
        project["title"] = project_title
        project["class"] = ""
        project["semester"] = ""
        project["members"] = []
        project["description"] = "This might be a good place to describe your project."
        project["chunk_list"] = []
        result = db.posts.insert_one(project).inserted_id
        print("Creating new project with id: {}".format(str(result)))
        return JSONEncoder().encode(str(result))


@app.route('/api/new_project/github/<github_url>')
def github_upload(github_url):
    github_url = github_url[1:-1]
    pieces = github_url.split("/")
    title = pieces[4] + ".png"
    site_url = get_site_from_github(github_url)
    url_img_dict = {}
    if site_url != "":
        get_screenshot(site_url, title)
        url_img_dict = {github_url: title}
        url_img_dict = upload_screenshots(url_img_dict)
        print(url_img_dict)
    fill_database_from_github(create_image_chunks(url_img_dict))
    return retrieve_github_object_id(github_url)


empty_database()    # Try to use these
fill_database()     # two functions together

print("Done filling database!")

# cursor = db.posts.find({})
# for document in cursor: 
#     pprint.pprint(document)

print("Starting up")


if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))