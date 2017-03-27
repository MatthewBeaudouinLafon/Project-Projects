import os
from flask import Flask, redirect, render_template, request, url_for, Response
from pymongo import MongoClient
import pymongo
from datetime import datetime
import csv
import urllib.request
import pprint

app = Flask(__name__)

@app.route('/')
def home():
    return "We're good"

# running retrieve_all_information() will give you a dictionary
# key: project ID (numbered 1 through however many projects)
# value: array of project name, project members, description

# all data gets uploaded to mongo

def retrieve_project_names():
    project_names = []
    with open("SDFinal.csv", 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            name = row[0].replace(".","-")
            project_names.append(name)
    project_names = project_names[1:] # get rid of first line
    return project_names

def retrieve_project_members():
    project_members = []
    with open("SDFinal.csv", 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            temp = row[1:5]
            new_temp = []
            for students in temp:
                if (students != ''):
                    new_temp.append(students)
            project_members.append(new_temp)
    project_members = project_members[1:] # get rid of first line
    return project_members

def retrieve_descriptions():
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
                descriptions.append(web)
            except:
                pass # essentially, do nothing
    return descriptions

def retrieve_all_information():
    names = retrieve_project_names()
    members = retrieve_project_members()
    descriptions = retrieve_descriptions()
    final = {}
    count = 0
    for name in names:
        temp = {}
        key = str(count) # Official dictionary key
        # key_temp = name # Temporary dictionary key
        val1 = members[count]
        val2 = descriptions[count][0:100] + "..."
        # value = [val1, val2]
        temp["title"] = name
        temp["members"] = val1
        temp["description"] = val2
        final[key] = temp
        count += 1
    return final

client = MongoClient('localhost', 27017)
db = client.test
posts = db.posts

def fill_database():
    dictionary = retrieve_all_information()
    for key, value in dictionary.items():
        pprint.pprint(dictionary[key])
        posts.insert_one(dictionary[key])

fill_database()

# Given project name, retrieve the rest of the project's information
@app.route('/project', methods=["GET"])
def retrieve_project(project_name):
    for post in posts.find():
        pprint.pprint(post)
    project_information = db.posts.find({"title": project_name})
    return project_information

# retrieve_project("")

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))