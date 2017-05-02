import os
from flask import Flask, redirect, render_template, request, url_for, Response
from pymongo import MongoClient
import pymongo
import csv
import urllib.request
import pprint
import re
from bson import ObjectId
from selenium import webdriver
from imgurpython import ImgurClient
import os

from private_database_functions import update_database, retrieve_JSON_Object, get_site_from_github, create_image_chunks, get_screenshot, fill_database_from_github, retrieve_github_object_id, JSONEncoder
# from database_functions import fill_database, empty_database, update_database, retrieve_JSON_Object, get_site_from_github, get_screenshot, fill_database_from_github, retrieve_github_object_id

print("Connecting to Database...")
client = MongoClient('localhost', 27017)
db = client.test
posts = db.posts
print("Done")

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
    """
    Retrieves all projects from the database and returns them as a JSON-formatted object.
    """
    print("Getting all projects")
    REGEX = ".*"
    search_item = re.compile(REGEX, re.IGNORECASE)
    project_information = list(db.posts.find({"title" : search_item}))
    output = JSONEncoder().encode(project_information)
    return output


@app.route('/api/project/<project_id>', methods=["POST"]) 
def save_project(project_id):
    """
    Saves a project in the database. If it didn't exist in the database before, it creates a new document and stores the projects information in the document. Otherwise, it finds the document in the database and updates its information.
    """
    if request.method == "POST":
        print("Setting project #{}".format(project_id))
        data = request.get_json(force=True)
        print(data)
        update_database(data, ObjectId(project_id))
    return "whatever"


@app.route('/api/project/<project_id>', methods=["GET"]) 
def send_project(project_id):
    """
    Sends over the project with the given project ID.
    """
    if request.method == "GET":
        print("Getting project #{}".format(project_id))
        return retrieve_JSON_Object(project_id)


@app.route('/api/new_project/', methods=["GET"])
def new_project():
    """
    Creates a new project with blank fields for the user to edit.
    """
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
    """
    Renames a given project.
    """
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
    """
    Uploads a document from its Github URL (used for Githubs that have their own sites).
    """
    pieces = github_url.split("/")
    title = pieces[4] + ".png"
    site_url = get_site_from_github(github_url)
    url_img_dict = {}
    if site_url != "":
        get_screenshot(site_url, title)
        url_img_dict = {github_url: title}
    fill_database_from_github(create_image_chunks(url_img_dict))
    return retrieve_github_object_id(github_url)

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))