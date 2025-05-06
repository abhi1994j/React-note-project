import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { MdDelete } from "react-icons/md";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor\n\nStart editing...");
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveNote = () => {
    if (selectedNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[selectedNoteIndex] = markdown;
      setNotes(updatedNotes);
    } else {
      setNotes([...notes, markdown]);
      setSelectedNoteIndex(notes.length);
    }
  };

  const handleNoteSelect = (index) => {
    setSelectedNoteIndex(index);
    setMarkdown(notes[index]);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    if (selectedNoteIndex === index) {
      if (updatedNotes.length > 0) {
        // If the deleted note was selected, select the last note
        setSelectedNoteIndex(updatedNotes.length - 1);
        setMarkdown(updatedNotes[updatedNotes.length - 1]);
      } else {
        // If no notes are left, reset everything
        setSelectedNoteIndex(null);
        setMarkdown("");
      }
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`} data-color-mode={darkMode ? "dark" : "light"}>
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">Your Notes</h2>
        <ul className="space-y-2">
          {notes.map((note, index) => (
            <li
              key={index}
              onClick={() => handleNoteSelect(index)}
              className={`cursor-pointer p-2 rounded ${selectedNoteIndex === index ? "bg-blue-500 text-white" : "hover:bg-gray-300 dark:hover:bg-gray-700"}`}
            >
              Note {index + 1}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering onClick of note item
                  handleDeleteNote(index);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <MdDelete />
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleSaveNote}
          className="mt-4 w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Save Note
        </button>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Markdown Editor & README Generator</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded bg-gray-200 text-sm dark:bg-gray-700 dark:text-white"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Download README.md
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Editor</h2>
            <MDEditor value={markdown} onChange={setMarkdown} height={500} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <div className="h-[500px] overflow-y-auto border border-gray-300 rounded p-4">
              <MarkdownPreview source={markdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
