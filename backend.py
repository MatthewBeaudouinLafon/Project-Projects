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

print("Connecting to Database...")
client = MongoClient()#'localhost', 27017)
db = client.test
posts = db.posts
print("Done")

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

app = Flask(__name__)

@app.route('/')
def home():
    return "We're good"

# running retrieve_all_information() will give you a dictionary
# key: project ID (numbered 1 through however many projects) DEPRECATED
# value: array of project name, project members, description

# all data gets uploaded to mongo

def retrieve_project_names(file_name):
    project_names = []
    with open(file_name, 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            name = row[0].replace(".","-")
            project_names.append(name)
    project_names = project_names[1:] # get rid of first line
    return project_names

def retrieve_project_members(file_name, members_range):
    project_members = []
    with open(file_name, 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            temp = row[1:members_range] # 5 for SoftDes, 7 for POE
            new_temp = []
            for students in temp:
                if (students != ''):
                    new_temp.append(students)
            project_members.append(new_temp)
    project_members = project_members[1:] # get rid of first line
    return project_members

def retrieve_SD_descriptions():
    descriptions = []
    start = '<article class="markdown-body entry-content" itemprop="text">'
    end = '</article>'
    with open("SDFinal.csv", 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            temp = row[5][19:].replace(".git","")
            page = "https://raw.githubusercontent.com/" + temp + "/master/README.md"
            try:
                web = urllib.request.urlopen(page).read().decode('utf-8')
                descriptions.append(web[:100] + "...")
            except:
                pass # essentially, do nothing
    return descriptions

def retrieve_POE_descriptions():
    descriptions = []
    with open("POEProjects.csv", "rt") as f:
        reader = csv.reader(f)
        for row in reader:
            descriptions.append(row[7][:100] + "...")
    return descriptions

def retrieve_all_information():
    SD_names = retrieve_project_names("SDFinal.csv")
    SD_members = retrieve_project_members("SDFinal.csv", 5)
    SD_descriptions = retrieve_SD_descriptions()

    # POE_names = retrieve_project_names("POEProjects.csv")
    # POE_members = retrieve_project_members("POEProjects.csv", 7)
    # POE_descriptions = retrieve_POE_descriptions()
    POE_names = []

    final = {}
    count = 0

    for name in SD_names:
        temp = {}
        key = str(count) # Official dictionary key
        val1 = SD_members[count]
        val2 = SD_descriptions[count]
        temp["title"] = name
        temp["class"] = "Software Design"
        temp["semester"] = "SP2016"
        temp["members"] = val1
        temp["description"] = val2
        temp["chunk"] = {"type": "text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}
        final[key] = temp
        count += 1
    
    for name in POE_names:
        temp = {}
        key = str(count) # Official dictionary key
        val1 = POE_members[count-len(SD_names)]
        val2 = POE_descriptions[count-len(SD_names)]
        temp["title"] = name
        temp["class"] = "Principles of Engineering"
        temp["semester"] = "FA2014"
        temp["members"] = val1
        temp["description"] = val2
        temp["chunk"] = {"type": "text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}
        final[key] = temp
        count += 1
    return final


# Initial filling-in of database, USE SPARINGLY @EMILY
def fill_database():
    print("Filling Database")
    dictionary = retrieve_all_information()
    for key in dictionary:
        result = db.posts.insert_one(dictionary[key]).inserted_id
    print (db.posts.count())


# Deletes ALL the documents in the database. Use with caution!!!!!
def empty_database():
    db.posts.delete_many({})
    print(db.posts.count())


# Updates document in database with new information
def update_database(JSON_Object, object_id=0):
    db.posts.update({ "_id": object_id },
        {"$set": { "updated_info": JSON_Object}},
        upsert=True)


def retrieve_JSON_Object(object_id):
    project_information = db.posts.find_one({'_id': ObjectId(object_id)})
    output = JSONEncoder().encode(project_information)
    return output


# Given project name, retrieve the rest of the project's information
@app.route('/api/<project_name>')
def retrieve_project(project_name):
    print("Requesting project_name={}".format(project_name))
    REGEX = ".*"
    print("Regex: {}".format(REGEX + project_name + REGEX))
    search_item = re.compile(REGEX + project_name + REGEX, re.IGNORECASE)
    project_information = list(db.posts.find({"title" : search_item}))
    output = JSONEncoder().encode(project_information)
    return output


@app.route('/api/project/<project_id>', methods=["POST"]) 
def save_project(project_id):
    if request.method == "POST":
        print("TESTING")
        data = request.get_json(force=True)
        print(data)
        update_database(data, project_id)
    return "whatever"
    # Could be dangerous to use Mongo ID here??????


# @param: Github URL
def get_site_from_github(url):
    start = '<span itemprop="url"><a href="'
    end = '" rel="nofollow">h'
    try:
        web = urllib.request.urlopen(url).read().decode('utf-8')
        index1 = web.find(start) + len(start)
        index2 = web.find(end)
        if (index2 > index1):
            site_url = web[index1:index2]
        return site_url
    except:
        print("ERROR! Invalid URL: " + url)
        pass

# @param: Site URL, name of screenshot (including file type)
def get_screenshot(url, screenshot_name):
    depot = DepotManager.get()
    driver = webdriver.PhantomJS('/home/emily/Downloads/phantomjs-2.1.1-linux-x86_64/bin/phantomjs')
    driver.set_window_size(1024, 768)
    driver.get(url)
    driver.save_screenshot(screenshot_name)

# Generates images for all valid SoftDes projects
# Use with caution (WE'RE LOOKING AT YOU EMILY)
def get_SD_sites():
    githubs = []
    with open("SDFinal.csv", 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            githubs.append(row[5])
    githubs = githubs[1:] # All site URLs stored here

    count = 0
    for github in githubs:
        site_url = get_site_from_github(github)
        if (site_url != None):
            get_screenshot(site_url, (str(count) + ".png"))
            count = count + 1





# retrieve_JSON_Object()

# pprint.pprint(retrieve_all_information())

empty_database()    # Try to use these
fill_database()     # two functions together :^)



if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))