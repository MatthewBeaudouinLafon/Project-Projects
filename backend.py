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
        val1 = members[count]
        val2 = descriptions[count][0:100] + "..."
        temp["title"] = name
        temp["members"] = val1
        temp["description"] = val2
        final[key] = temp
        count += 1
    return final


def fill_database(JSON_Object, object_id=0):
    print("Filling Database")
    dictionary = retrieve_all_information()
    if object_id == 0:
        for key, value in JSON_Object:
            result = posts.insert_one(dictionary[key]).inserted_id
            print(result)
    else:
        print("Here we are")
        db.posts.update({ "_id": object_id },
            {"$set": { "updated_info": JSON_Object}},
            upsert=True)

    # for i in range(0, len(JSON_Object)):
    #     result = posts.insert_one(JSON_Object[i]).inserted_id
    #     # print(result)
    #     print(JSON_Object[i])

        # db.posts.update(
        #    { "_id": object_id },
        #    {
        #      "$set": { "updated_info": str(JSON_Object)}
        #    }
        # )

        # print(db.posts.find());
        # post = list(db.posts.find({'_id': object_id}))
        
        # if post is not None:
        #     print(post)
        #     post[0] = JSON_Object
        #     db.posts.save(post)
        # db.posts.update({'_id':object_id},
        #     {"$set": JSON_Object},
        #     upsert=False)


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
        fill_database(data, project_id)
    return "whatever"
    # Could be dangerous to use Mongo ID here


# retrieve_JSON_Object()

print (retrieve_all_information())


if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)), host=os.environ.get("HOST", '127.0.0.1'))