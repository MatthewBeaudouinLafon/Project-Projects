import csv
import urllib.request
import pprint
from selenium import webdriver
from depot.manager import DepotManager
from imgurpython import ImgurClient
import os

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

def get_screenshot(url, screenshot_name):
    depot = DepotManager.get()
    driver = webdriver.PhantomJS('/home/emily/Downloads/phantomjs-2.1.1-linux-x86_64/bin/phantomjs')
    driver.set_window_size(1024, 768)
    driver.get(url)
    driver.save_screenshot(screenshot_name)

# Returns dictionary of Github URLs and screenshot names
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

def upload_screenshots(url_img_dict):
    # client_id = os.environ.get("CLIENT_ID", "")
    # client_secret = os.environ.get("CLIENT_SECRET", "")
    # client = ImgurClient(client_id, client_secret)
    client = ImgurClient("7203db1fc7d338b", "811ee971f810a52b70d6c18e5968f207d4a0eb05")
    # print(client.upload_from_path("0.png")['link'])
    for key in url_img_dict:
        if (url_img_dict[key] != ""):
            url_img_dict[key] = client.upload_from_path(url_img_dict[key])['link']
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

# {'This is a website URL': {'type': 'Image', 'content': {'alt': 'Screenshot', 'description': 'A screenshot of the website.', 'link': 'http://i.imgur.com/Si7ioJ9.png'}}}


# @param Dictionary of format Github URL: Imgur URL
def fill_database_from_github(url_img_dict):
    final = {}
    count = 0
    for url in url_img_dict:
        temp = {}
        temp["title"] = name
        temp["class"] = ""
        temp["semester"] = ""
        temp["members"] = ""
        temp["description"] = ""
        temp["image_chunk"] = url_img_dict[url]
        temp["chunk"] = {"type": "text", "content": {"text":"My god this is a chunk of text. I never could have figured out how chunky it gets out there in terms of text."}}
        final[count] = temp
        count++
    for key in final:
        result = db.posts.insert_one(final[key]).inserted_id

# site_url = get_site_from_github("https://github.com/abuchele/DungeonCrawler")
# get_screenshot(site_url, "testing.png")
# print(site_url)
# get_SD_sites()

        # {
        #     type:"Image",
        #     content: {
        #         link:"https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
        #         alt:"This is a cat in burriot form",
        #         description:"The famed \"Burrito Cat\""
        #     }
        # }

# print(upload_screenshots(get_SD_sites()))

# To do: Generate chunk list

# 7203db1fc7d338b
# 811ee971f810a52b70d6c18e5968f207d4a0eb05

example_dict = {"This is a website URL": "0.png"}

print(create_image_chunks(upload_screenshots(example_dict)))