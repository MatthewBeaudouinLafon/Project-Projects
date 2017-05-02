from pymongo import MongoClient
import pymongo
import csv
import urllib.request
import pprint
import json


client = MongoClient('localhost', 27017)
db = client.test
posts = db.posts

# running retrieve_all_information() will give you a dictionary
# key: project ID (numbered 1 through however many projects) DEPRECATED
# value: array of project name, project members, description

# all data gets uploaded to mongodb

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


def retrieve_project_names(file_name):
    """
    Retrieves names of projects from file_name.csv
    @param: Name of CSV
    """
    project_names = []
    with open(file_name, 'rt') as f:
        reader = csv.reader(f)
        for row in reader:
            name = row[0].replace(".","-")
            project_names.append(name)
    project_names = project_names[1:] # get rid of first line
    return project_names


def retrieve_project_members(file_name, members_range):
    """
    Retrieves names of project members from file_name.csv, depending on the number of members in the team.
    @param: Name of CSV, total number of members in project
    """
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


def retrieve_all_information(file_name="", number_of_members=0):
    final = {}

    if (file_name != ""):
        names = retrieve_project_names(file_name)
        members = retrieve_project_members(file_name, number_of_members)

        count = 0

        for name in names:
            temp = {}
            key = str(count) # Official dictionary key
            temp["title"] = name
            temp["class"] = ""
            temp["semester"] = ""
            temp["members"] = members[count]
            temp["description"] = ""
            image_chunk = ""
            temp["chunk_list"] = [image_chunk, {"type": "Text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}]
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