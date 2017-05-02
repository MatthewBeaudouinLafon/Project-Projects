Welcome to Project-Projects's documentation!
============================================

**A Table of Contents**

.. toctree::
   :maxdepth: 1

   index
   react
   python

.. automodule:: backend

An Introduction
---------------

Olin students can now record their projects in Project: Projects to keep track of all the cool stuff they've done, easily build their portfolios, and share their experiences. This is a project started by Matthew Beaudouin-Lafon (Olin College '19) and Emily Yeh (also Olin College '19).

Our Inspiration
---------------

After surveying 45 students at Olin (a whole 12.8% of the student body), it was discovered that recording projects is something of an ordeal for most Oliners. Some respondents created their own websites and portfolios, while about a third said that they had not created any kind of professional project archive yet. In addition, about half of the respondents reported that they update their websites, portfolios, or PDFs only when job season is imminent. This all seemed to be a strong sign that the experience of recording projects at Olin has room for improvement.

Faculty were also asked for their thoughts on recording projects at Olin. The reasons that professors have for archiving projects range from personal reasons (learning from past mistakes, refreshing themselves on course policies, etc.) to institutional reasons (training new faculty members, giving prospective student tours something to look at, etc.) to students' reasons (past students contact their professors years down the road to ask if they still have records of their projects, because they have a job interview coming up and it would look really good if they could show it).

All of this feedback was gathered to form the basis for the creation of this project. Project: Projects is going to make the lives of students easier by facilitating the creation of portfolios and lowering the activation energy for recording projects, and it's also going to make the lives of faculty easier by placing all student projects in one convenient location.

Installation
------------

On OS and Linux, enter the following into a terminal, one line at a time (replacing <path/to/file> with the path to the downloaded file):

.. code-block:: guess

   git clone https://github.com/MatthewBeaudouinLafon/Project-Projects
   cd <path/to/file>
   python3 backend.py

Then, open another terminal and enter the following, one line at a time (once again replacing <path/to/file> with the path to the downloaded file):

.. code-block:: guess

   cd <path/to/file/webapp/src>
   npm install
   npm start

The app should now be running on localhost:9090. Navigate to localhost:9090 in your web browser. If there are any issues with installing and starting the app, please refer to the app's libraries and dependencies.



.. Indices and tables
.. ==================

.. * :ref:`modindex`
.. * :ref:`search`

