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

client = MongoClient('localhost', 27017)
db = client.test
posts = db.posts

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
    Retrieves names of projects from file_name.csv.
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
        temp["semester"] = toOlinEpoch("SP2016")
        temp["members"] = val1
        temp["description"] = val2
        image_chunk = ""
        temp["chunk_list"] = [image_chunk, {"type": "Text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}]
        final[key] = temp
        count += 1
    
    for name in POE_names:
        temp = {}
        key = str(count) # Official dictionary key
        val1 = POE_members[count-len(SD_names)]
        val2 = POE_descriptions[count-len(SD_names)]
        temp["title"] = name
        temp["class"] = "Principles of Engineering"
        temp["semester"] = toOlinEpoch("FA2014")
        temp["members"] = val1
        temp["description"] = val2
        image_chunk = ""
        temp["chunk_list"] = [image_chunk, {"type": "Text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}]
        final[key] = temp
        count += 1
    return final


# Initial filling-in of database, USE SPARINGLY @EMILY
def fill_database():
    print("Filling Database...")
    dictionary = retrieve_all_information()
    for key in dictionary:
        result = db.posts.insert_one(dictionary[key]).inserted_id
    print("Database successfully filled! Number of objects now: " + str(db.posts.count()))


# Deletes ALL the documents in the database. Use with caution!!!!!
def empty_database():
    print("Emptying database...")
    db.posts.delete_many({})
    print("Database successfully emptied! Number of objects now: " + str(db.posts.count()))


# Updates document in database with new information
def update_database(JSON_Object, object_id=0):
    db.posts.update({ "_id": object_id },
        {"$set": { 
            "title": JSON_Object["title"],
            "semester": JSON_Object["semester"],
            "members": JSON_Object["members"],
            "description": JSON_Object["description"],
            "chunk_list": JSON_Object["chunk_list"],
            }},
        upsert=True)
    return "Updated database"


def retrieve_JSON_Object(object_id):
    project_information = db.posts.find_one({'_id': ObjectId(object_id)})
    output = JSONEncoder().encode(project_information)
    print(project_information)
    return output

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
    url_img_dict = {}
    for github in githubs:
        site_url = get_site_from_github(github)
        if (site_url != None):
            get_screenshot(site_url, (str(count) + ".png"))
            url_img_dict[github] = str(count) + ".png"
            count = count + 1
        else:
            url_img_dict[github] = ""
    return url_img_dict


# MUST set client_id and client_secret in environment first
def upload_screenshots(url_img_dict):
    client_id = os.environ.get("CLIENT_ID", "")
    client_secret = os.environ.get("CLIENT_SECRET", "")
    client = ImgurClient(client_id, client_secret)
    for key in url_img_dict:
        if (url_img_dict[key] != ""):
            url_img_dict[key] = client.upload_from_path(url_img_dict[key])['link']
            print(url_img_dict[key])
    return url_img_dict


def create_image_chunks(url_img_dict):
    result = {}
    for key in url_img_dict:
        chunk_type = "Image"
        content = {}
        content['link'] = url_img_dict[key]
        content['alt'] = "Screenshot"
        content['description'] = "A screenshot of the website."
        final_chunk = {}
        final_chunk['type'] = chunk_type
        final_chunk['content'] = content
        result[key] = final_chunk
    return result


# @param Dictionary of format Github URL: Imgur URL
def fill_database_from_github(url_img_dict):
    final = {}
    count = 0
    for url in url_img_dict:
        pieces = url.split("/")
        temp = {}
        temp["url"] = url
        temp["title"] = pieces[4]
        temp["class"] = ""
        temp["semester"] = ""
        temp["members"] = ""
        temp["description"] = ""
        image_chunk = url_img_dict[url]
        temp["chunk_list"] = [image_chunk, {"type": "Text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}]
        final[count] = temp
        # pprint.pprint(final)
        count += 1
    for key in final:
        result = db.posts.insert_one(final[key]).inserted_id



def retrieve_github_object_id(github_url):
    project_information = list(db.posts.find({'url': github_url}))
    # print(project_information[0]['_id'])
    return project_information[0]['_id']