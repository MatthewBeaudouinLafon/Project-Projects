Python Backend and Database
===========================

Here, you will find documentation of all Python functions. All Python files are found in the main folder. There are three files: :code:`backend.py`, :code:`database_functions.py`, and (temporarily) :code:`private_database_functions.py`, which depends on the inclusion of some private :code:`.csv files`. Email or message either Matthew or Emily to get access to these files.

Not seeing what you need? `Return to the homepage <index.html>`_.

:code:`backend.py`
----------

*Contains all the functions necessary to run the app, but does not include the database functions. To view the database functions, see :code:`private_database_functions.py`'s documentation.*


.. function:: retrieve_all_project()

   Retrieves all projects from the database and returns them as a JSON-formatted object.

.. function:: send_project(project_id)

   Sends over the project with the given project ID.

   :param project_id: string type

.. function:: new_project()

   Creates a new project with blank fields for the user to edit.

.. function:: new_project_name(project_title)

   Renames a given project.

   :param project_title: string type

.. function:: github_upload(github_url)

   Uploads a document from its Github URL (used for Githubs that have their own sites).

   :param github_url: string type

:code:`private_database_functions.py`
-----------------------------

*Contains all the functions necessary to populate and empty the (MongoDB) database, but does not include the app's backend functions. To view the app's backend functions, see :code:`backend.py`'s documentation.*

.. function:: toOlinEpoch(human_readable)

   OlinEpoch is the number of years since Fall 2002 (ie.: the first Olin semester). Semesters split the year equally. The beginning of the semester counts date wise.

   :param human_readable: string type

.. function:: retrieve_project_names(file_name)

   Retrieves names of projects from file_name.csv.

   :param file_name: string type

.. function:: retrieve_project_members(file_name, members_range)

   Retrieves names of project members from file_name.csv, depending on the number of members in the team.

   :param file_name: string type
   :param members_range: integer type

.. function:: retrieve_SD_descriptions()

   Retrieves all descriptions from Githubs found in the (private) SD .csv file.

.. function:: retrieve_POE_descriptions()

   Retrieves all descriptions from POE websites found in the (private) POE .csv file.

.. function:: retrieve_all_information()

   Retrieves all available information about projects and returns them in a dictionary (which can be conveniently injected into the database).

.. function:: fill_database()

   Fills the database with all projects' information.

.. function:: empty_database()

   Empties the database of all documents.

.. function:: update_database(JSON_Object, object_id=0)

   Updates document in database with new information.

   :param JSON_Object: string type
   :param object_id: string type

.. function:: retrieve_JSON_Object(object_id)

   Retrieves a JSON object from the database by its object ID.

   :param object_id: string type

.. function:: get_site_from_github(url)

   Retrieves a Github SITE URL from the Github's OWN URL.

   :param url: string type

.. function:: get_screenshot(url, screenshot_name)

   Makes and stores a screenshot of the Github SITE, if it exists.

   :param url: string type
   :param screenshot_name: string type

.. function:: get_SD_sites()

   Generates images for all valid SoftDes projects.

.. function:: upload_screenshots(url_img_dict)

   Uploads screenshots of all Github SITES to the database. Note that you MUST set client_id and client_secret in environment first. (See ImgurPython for more details.)

   :param url_img_dict: dictionary type

.. function:: create_image_chunks(url_img_dict)

   Generates image chunks with mostly blank fields.

   :param url_img_dict: dictionary type

.. function:: fill_database_from_github(url_img_dict)

   Fills the database with a document with an image chunk from a Github URL.

   :param url_img_dict: dictionary type

.. function:: retrieve_github_object_id(github_url)

   Retrieves a document from the site with the given Github URL, if it exists.

   :param github_url: string type
