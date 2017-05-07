Project: Projects's Documentation
=================================

Contents:

.. toctree::
   :maxdepth: 1

   index
   react
   python

.. automodule:: backend
   :members:

An Introduction
---------------

Welcome to Project: Project's docs!

Olin students can now record their projects in Project: Projects to keep track of all the cool stuff they've done, easily build their portfolios, and share their experiences. This is a project started by Matthew Beaudouin-Lafon (Olin College '19) and Emily Yeh (also Olin College '19).

Our Inspiration
---------------

After surveying 45 students at Olin (a whole 12.8% of the student body), it was discovered that recording projects is something of an ordeal for most Oliners. Some respondents created their own websites and portfolios, while about a third said that they had not created any kind of professional project archive yet. In addition, about half of the respondents reported that they update their websites, portfolios, or PDFs only when job season is imminent. This all seemed to be a strong sign that the experience of recording projects at Olin has room for improvement.

Faculty were also asked for their thoughts on recording projects at Olin. The reasons that professors have for archiving projects range from personal reasons (learning from past mistakes, refreshing themselves on course policies, etc.) to institutional reasons (training new faculty members, giving prospective student tours something to look at, etc.) to students' reasons (past students contact their professors years down the road to ask if they still have records of their projects, because they have a job interview coming up and it would look really good if they could show it).

All of this feedback was gathered to form the basis for the creation of this project. Project: Projects is going to make the lives of students easier by facilitating the creation of portfolios and lowering the activation energy for recording projects, and it's also going to make the lives of faculty easier by placing all student projects in one convenient location.

Installation
------------

On OS and Linux, enter the following into a terminal, one line at a time (replacing :code:`path/to/file` with the path to the downloaded file):

.. code-block:: guess

   git clone https://github.com/MatthewBeaudouinLafon/Project-Projects
   cd path/to/file
   python3 backend.py

The backend of the app should now be running on your machine. You will see a confirmation in the terminal. If you run into any difficulties during this step in the process, please refer to the app's dependencies_.

Then, open another terminal and enter the following, one line at a time (once again replacing :code:`path/to/file` with the path to the downloaded file):

.. code-block:: guess

   cd path/to/file/webapp/src
   npm install
   npm start

The app should now be running on :code:`localhost:9090`. Navigate to :code:`localhost:9090` in your web browser. If there are any issues with installing and starting the app, please refer to the app's dependencies_.

More about the App
--------------------------------------

`React Components <react.html>`_
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Here, you will find documentation of all React components, including those that make up the homepage, the main projects page, and the project editing page. This is where you should look if you're running into problems with the frontend of the app.

`Python Backend and Database <python.html>`_
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Here, you will find documentation of all Python functions, including those that make up the backend of the app and those that populate and empty the database that the app runs on. This is where you should look if you're running into problems with the backend or the database of the app.

.. _dependencies:

Libraries and Dependencies
--------------------------

If the app does not work on your machine, please make sure you have each of these installed.

* react_
* react-youtube_
* mongodb_
* pymongo_
* flask_
* selenium_
* imgurpython_

Credits, Acknowledgements, and Future Work
------------------------------------------

Here's a very special thank you to Olin faculty **Oliver Steele**, **Jeff Goldenson**, and **Emily Ferrier** for their help in the development of this project!

This project is protected under the MIT license.

In terms of future work, there are many potential features to add that would make this app way more usable. Here are a few to start with.

* *A true project slideshow*: Give a glimpse of the next project before transitioning.
* *Importing and exporting*: Let projects be imported/exported in the form of a PDF, a JSON blob, etc.
* *Tags*: Allow users to add tags to their projects, and allow the projects to be found through tags.
* *Just make the app look better with CSS witchery*

There are many other potential features, as well as minor issues that are basically just unimplemented features, that can be added to our project. If you want to tackle some, try CTRL+F'ing "TODO" in any file.

.. _react: https://facebook.github.io/react/
.. _react-youtube: https://github.com/troybetz/react-youtube
.. _mongodb: https://www.mongodb.com/
.. _pymongo: https://api.mongodb.com/python/current/
.. _flask: http://flask.pocoo.org/
.. _selenium: http://www.seleniumhq.org/
.. _imgurpython: https://github.com/Imgur/imgurpython
