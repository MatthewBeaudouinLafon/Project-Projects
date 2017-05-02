# Project: Projects
> An Olin project database that makes life a little easier.

![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
[![License](https://img.shields.io/badge/license-MIT%20License-brightgreen.svg)](https://opensource.org/licenses/MIT)

Olin students can record their projects in **Project: Projects** to keep track of all the cool stuff they've done, easily build their portfolios, and share their experiences. This is a project started by Matthew Beaudouin-Lafon (Olin College '19) and Emily Yeh (also Olin College '19).

For full documentation of all pieces of code, look no further than [our documentation site](https://project-projects-docs.herokuapp.com/index.html).

![](http://i.imgur.com/AZn0MYk.png)

## Installation

On OS and Linux, enter the following into a terminal, one line at a time (replacing <path/to/file> with the path to the downloaded file):

```
git clone https://github.com/MatthewBeaudouinLafon/Project-Projects
cd <path/to/file>
python3 backend.py
```

Then, open another terminal and enter the following, one line at a time (once again replacing <path/to/file> with the path to the downloaded file):

```
cd <path/to/file/webapp/src>
npm install
npm start
```

The app should now be running on [localhost:9090]. Navigate to `localhost:9090` in your web browser. If there are any issues with installing and starting the app, please refer to the app's [libraries and dependencies](#dependencies).

## About Project: Projects

After surveying 45 students at Olin (a whole 12.8% of the student body), it was discovered that recording projects is something of an ordeal for most Oliners. Some respondents created their own websites and portfolios, while about a third said that they had not created any kind of professional project archive yet. In addition, about half of the respondents reported that they update their websites, portfolios, or PDFs only when job season is imminent. This all seemed to be a strong sign that the experience of recording projects at Olin has room for improvement.

Faculty were also asked for their thoughts on recording projects at Olin. The reasons that professors have for archiving projects range from personal reasons (learning from past mistakes, refreshing themselves on course policies, etc.) to institutional reasons (training new faculty members, giving prospective student tours something to look at, etc.) to students' reasons (past students contact their professors years down the road to ask if they still have records of their projects, because they have a job interview coming up and it would look really good if they could show it).

All of this feedback was gathered to form the basis for the creation of this project. **Project: Projects** is going to make the lives of students easier by facilitating the creation of portfolios and lowering the activation energy for recording projects, and it's also going to make the lives of faculty easier by placing all student projects in one convenient location.

// to do: Showcase features - page workflow, search, project creation, import from GitHub (gifs)

### Technical Documentation
To run the database, simply run the following commands.

```
cd <path/to/file>
python3 backend.py
```

The file automatically empties and refills its MongoDB database upon being run. However, the main functions dealing with populating and emptying the MongoDB database are located in ```private_database_functions.py``` (for now). Much of the data being used right now is student data, which is why the .csv files required to run ```private_database_functions.py``` are not located on this repository; however, if you would like to contribute to this project, please email Matthew or Emily to gain access to those .csvs (after we screen you rigorously for ill intentions).

### Status of Things

<a name="dependencies"></a>
## Libraries & Dependencies
* [react](https://facebook.github.io/react/)
* [react-youtube](https://github.com/troybetz/react-youtube)
* [mongodb](https://www.mongodb.com/)
* [pymongo](https://api.mongodb.com/python/current/)
* [flask](http://flask.pocoo.org/)
* [selenium](http://www.seleniumhq.org/)
* [imgurpython](https://github.com/Imgur/imgurpython)

## Known Issues & Future Work

There are many potential features to add that would make this app way more usable. Here are a few to start with:

* A true project slideshow: Give a glimpse of the next project before transitioning.
* Importing and exporting: Let projects be imported/exported in the form of a PDF, a JSON blob, etc.
* Tags: Allow users to add tags to their projects, and allow the projects to be found through tags.
* Just make the app look better with CSS witchery

There are many other potential features, as well as minor issues that are basically just unimplemented features, that can be added to our project. If you want to tackle some, try CTRL+F'ing "TODO" in any file.

## Contributing

1. Fork it (<https://github.com/MatthewBeaudouinLafon/Project-Projects/fork>)
2. Create your feature branch (`git checkout -b feature/FEATURE`)
3. Commit your changes (`git commit -am 'Add some FEATURE'`)
4. Push to the branch (`git push origin feature/FEATURE`)
5. Create a new pull request
6. That's it!

## Credits

<sub>Thank you to Oliver Steele, Jeff Goldenson, and Emily Ferrier for their help in the development of this project!</sub>

<sub>Copyright 2017 Matthew Beaudouin-Lafon & Emily Yeh</sub>

<sub>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</sub>

<sub>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</sub>

<sub>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</sub>
