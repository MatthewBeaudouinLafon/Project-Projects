from pymongo import MongoClient
from datetime import datetime
import csv
import urllib.request

client = MongoClient('localhost', 27017)

db = client.test

# so it's been a while since i used python
# try not to notice how inefficient and dum some of these functions are :^)

# running retrieve_all_information() will give you a dictionary
# key: project name
# value: array of project members, description

# all data gets uploaded to mongo - check logs for key

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
		key = name
		val1 = members[count]
		val2 = descriptions[count]
		value = [val1, val2]
		final[key] = value
		count += 1
	return final

print (retrieve_all_information())

# dictionary = retrieve_all_information()
# posts = db.posts
# post_id = posts.insert_one(dictionary).inserted_id 
# print(post_id)