React Components
================

.. _intro:

Here, you will find documentation of all React componenets, painstakenly hand-typed by Matthew and extracted by Emily. For the record, auto-generating React documentation is a real pain in the butt.

All React files and components are found under /webapp/src.

Not seeing what you need? `Return to the homepage <index.html>`_.

.. toctree::
   :maxdepth: 5





*Homepage.jsx*
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





*App.jsx*
-------

You can `return to the homepage <index.html>`_ or click here to return to the intro_ or keep scrolling to learn more.

*App.jsx is the root component for the project browser.*

updateFromDB(json)
~~~~~~~~~~~~~~~~~~

A **function** that, if the database is populated, populates the component's state with the projects in the database.

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





*ProjectForm.jsx*
-------

You can `return to the homepage <index.html>`_ or click here to return to the intro_ or keep scrolling to learn more.

*ProjectForm.jsx is the root component for the project form page.*

updateFromDB(json)
~~~~~~~~~~~~~~~~~~

A **function** that, if the database is populated, populates the component's state with the projects in the database.

addChunk(context)
~~~~~~~~~~~~~~~~~

A **function** that adds a new chunk; style depends on the button pressed.

handleChunkChange(newContent, key)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A **function** that updates appropriate the chunk with new content.

convertChunk(chunk, key)
~~~~~~~~~~~~~~~~~~~~~~~~

A **function** that converts a JSON representation of a chunk into a React Component.

changeEditState()
~~~~~~~~~~~~~~~~~

A **function** that toggles the Edit state, saving when going from editing to not.

FormHeader
~~~~~~~~~~

A **component** that contains the top of the form: project name, authors and description.

Chunk
~~~~~

A **component** that renders a chunk (text, image or video). Depending on the type, it displays text, image or video with caption. Also enables editing when appropriate.

handleFieldChange(changedContentField, fieldName)
`````````````````````````````````````````````````

A **function** that formats input for this.props.handleChunkChange.

getTextChunk()
``````````````

A **function** that constructs a Text Chunk, depending on edit status.

getImageChunk()
``````````````

A **function** that constructs an Image Chunk, depending on edit status.

getVideoChunk()
``````````````

A **function** that constructs a Video Chunk, depending on edit status.

EmptyChunk
~~~~~~~~~~

A **component** that is used when the chunk type is not recognized. This should really never get called.

NewChunk
~~~~~~~~

A **component** that contains the form footer. When editing, it displays the new chunk buttons.

Button
~~~~~~

A **component** that contains a generic button. Used for edit/save and new chunk buttons.

SmallInput
~~~~~~~~~~

A **component** that is a generic small input. Used for editing captions.

MediumInput
~~~~~~~~~~

A **component** that is a generic medium input. Used for editing text boxes.