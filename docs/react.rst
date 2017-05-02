React Components
================

.. _intro:

Here, you will find documentation of all React componenets, painstakenly hand-typed by Matthew and extracted by Emily. For the record, auto-generating React documentation is a real pain in the butt.

All React files and components are found under /webapp/src.

A table of contents: 

.. toctree::
   :maxdepth: 4

   react

Homepage.jsx
------------

*Homepage.jsx creates the website's home page. It contains a slideshow and a fixed navigation bar, which contains authentication fields.*

updateFromDB(json)
~~~~~~~~~~~~~~~~~~

A **function** that, if the database is populated, populates the component's state with the projects in the database.

ProjectDisplay
~~~~~~~~~~~~~~

A **component** that contains the main components of the Homepage class (slideshow and slide counter), wrapped in a div tag.

Slideshow
~~~~~~~~~

A **component** that contains a slideshow of ProjectItems.

ProjectItem
~~~~~~~~~~~

A **component** that contains all of a given project's information: name, authorList, and description.

ProjectName
~~~~~~~~~~~

A **component** that contains a given project's name.

Description
~~~~~~~~~~~

A **component** that contains a given project's description component.

AuthorList
~~~~~~~~~~

A **component** that contains a list of a given project's authors' names component, in which names are joined by commas.

Chunk
~~~~~

A **component** that displays chunks that are visible.

NavBar
~~~~~~

A navigation bar **component**, which contains authentication fields (for usernames and passwords).

PrevButton
~~~~~~~~~~

A backwards-facing arrow button **component**, which controls the slide that is displayed.

handleClick(event)
``````````````````

A **function** that handles the event in which a button is clicked, and results in the current slide index being *increased* by 1.

NextButton
~~~~~~~~~~~~~

A forwards-facing arrow button **component**, which controls the slide that is displayed.

handleClick(event)
``````````````````

A **function** that handles the event in which a button is clicked, and results in the current slide index being *decreased* by 1.





App.jsx
-------

Or click here to return to the intro_.

*App.jsx is the root component for the project browser.*

SearchBar
~~~~~~~~~

A **component** that handles query searching to be independent of specific keywords. (Uses Draftjs for highlighting features).

handleSearch(editorState)
`````````````````````````

A **function** that handles search. While this function is called every time the field changes, the search only gets run 1s after the last input.

parseStr(str)
`````````````

A **function** that returns the object of parsed string.

ProjectGrid
~~~~~~~~~~~

A **component** that renders the project grid. It takes in projectList as a prop, which is a JSON list.

NewProject
~~~~~~~~~~

A **component** that contains the first "project" in the grid. Allows for creation of new projects.

ProjectItem
~~~~~~~~~~~

A **component** that represents one of the projects in the grid.

ProjectName
~~~~~~~~~~~

A **component** that contains a given project's name.

Description
~~~~~~~~~~~

A **component** that contains a given project's description component.

AuthorList
~~~~~~~~~~

A **component** that contains a list of a given project's authors' names component, in which names are joined by commas.





ProjectForm.jsx
-------

Or click here to return to the intro_.