React Components
================

Here, you will find documentation of all React componenets, painstakenly hand-typed by Matthew and extracted by Emily. For the record, auto-generating React documentation is a real pain in the butt.

All React files and components are found under /webapp/src.

Homepage.jsx
------------

*Creates the website's home page. It contains a slideshow and a fixed navigation bar, which contains authentication fields.*

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

A function that handles the event in which a button is clicked, and results in the current slide index being *increased* by 1.

NextButton
~~~~~~~~~~~~~

A forwards-facing arrow button **component**, which controls the slide that is displayed.

handleClick(event)
``````````````````

A function that handles the event in which a button is clicked, and results in the current slide index being *decreased* by 1.