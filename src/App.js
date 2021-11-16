import React, { useState, useEffect } from "react";
import axios from "axios";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  /*   useEffect 
  - Effect runs after every completed render
  - However, you can choose to fire it only when certain values have changed
  - The second parameter specify how often the effect is run.
  - If the second parameter is an empty array [],
  then the effect is only run along with the first render of the component useEffect(hook, []);
  NOTE: TO COMMENT MULTIPLE LINES OF CODE LIKE THIS, WE USE "SHIFT + ALT + A" */

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);
  console.log("rendered", notes.length, "notes");

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        // Error Notification
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);

        // Remove it from the list on Client side
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  // if notesToShow === true, set to notes, otherwise, filter the one with "important === true"
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "Important" : "All"}
        </button>
      </div>
      {/* List of notes */}
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="Enter a new note here!!!"
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
