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

from private_database_functions import fill_database, empty_database, update_database, retrieve_JSON_Object, get_site_from_github, create_image_chunks, get_screenshot, fill_database_from_github, retrieve_github_object_id
# from database_functions import fill_database, empty_database, update_database, retrieve_JSON_Object, get_site_from_github, get_screenshot, fill_database_from_github, retrieve_github_object_id

print("Connecting to Database...")
client = MongoClient('localhost', 27017)
db = client.test
posts = db.posts
print("Done")

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def toOlinEpoch(human_readable):
    """
    OlinEpoch is the number of years since Fall 2002 (ie.: the first Olin semester)
    Semesters split the year equally. The beginning of the semester counts date wise (looking at you winter)
    Examples:
        SP2017 -> 14.5
        FALL2012 -> 10
        Winter 2014 -> 12.25
    """
    if "fa" in human_readable[:-4].lower():
        semesterAdjustment = 0
    if "w" in human_readable[:-4].lower():
        semesterAdjustment = 0.25
    if "sp" in human_readable[:-4].lower():
        semesterAdjustment = -0.5
    if "su" in human_readable[:-4].lower():
        semesterAdjustment = -0.25
    return int(human_readable[-4:]) - 2002 + semesterAdjustment

app = Flask(__name__)

@app.route('/')
def home():
    return "We're good"

# # Given project name, retrieve the rest of the project's information
# @app.route('/api/<project_name>')
# def retrieve_project(project_name):
#     print("Requesting project_name={}".format(project_name))
#     REGEX = ".*"
#     print("Regex: {}".format(REGEX + project_name + REGEX))
#     search_item = re.compile(REGEX + project_name + REGEX, re.IGNORECASE)
#     project_information = list(db.posts.find({"title" : search_item}))
#     output = JSONEncoder().encode(project_information)
#     return output

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

#TODO: Cut me some slack demo is in 30 minutes
@app.route('/api/new_project/github/<github_url>')
def github_upload(github_url):
    pieces = github_url.split("/")
    title = pieces[4] + ".png"
    site_url = get_site_from_github(github_url)
    url_img_dict = {}
    if site_url != "":
        get_screenshot(site_url, title)
        url_img_dict = {github_url: title}
    fill_database_from_github(create_image_chunks(url_img_dict))
    return retrieve_github_object_id(github_url)

github_upload("https://github.com/audreywl/baclaudio")

retrieve_github_object_id("https://github.com/audreywl/baclaudio")

# When someone uploads a project via Github, how much do we know about that project?
# Will start in edit mode

# retrieve_JSON_Object()

# pprint.pprint(retrieve_all_information())

empty_database()    # Try to use these
fill_database()     # two functions together :^)
# fill_database_from_github(create_image_chunks(upload_screenshots(get_SD_sites())))
print("Done filling database!")

# cursor = db.posts.find({})
# for document in cursor: 
#     pprint.pprint(document)


if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))