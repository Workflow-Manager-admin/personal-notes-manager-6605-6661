import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * App - Main entry for Notes Management UI.
 * Implements sidebar notes listing, create/edit/view/delete functionality,
 * responsive minimalistic design, and light color theme.
 */
function App() {
  // State model for notes: [{ id, title, content, updated }]
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "[]")
  );
  const [selectedNoteId, setSelectedNoteId] = useState(
    notes.length > 0 ? notes[0].id : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [mainViewForm, setMainViewForm] = useState({ title: "", content: "" });

  // Colors/theme constants
  const colors = {
    primary: "#1976d2",
    secondary: "#424242",
    accent: "#ffb300",
    text: "#222",
    background: "#fff",
    border: "#e0e0e0",
    sidebar: "#f7f7f7",
    sidebarActive: "#e2edfa",
    sidebarHover: "#e8f0fe",
  };

  // Save notes to localStorage for persistence
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // On mount or notes change, auto-select first note if none selected
  useEffect(() => {
    if (notes.length > 0 && !notes.find((n) => n.id === selectedNoteId)) {
      setSelectedNoteId(notes[0].id);
      setIsEditing(false);
    }
    if (notes.length === 0) {
      setSelectedNoteId(null);
      setIsEditing(false);
    }
  }, [notes]);

  // When selected note changes, set view/edit form
  useEffect(() => {
    const selectedNote = notes.find((n) => n.id === selectedNoteId);
    if (selectedNote && !isEditing) {
      setMainViewForm({
        title: selectedNote.title,
        content: selectedNote.content,
      });
    } else if (!selectedNote && !isEditing) {
      setMainViewForm({ title: "", content: "" });
    }
  }, [selectedNoteId, notes, isEditing]);

  // PUBLIC_INTERFACE
  function handleNoteSelect(noteId) {
    setSelectedNoteId(noteId);
    setIsEditing(false);
  }

  // PUBLIC_INTERFACE
  function handleCreateNote() {
    setMainViewForm({ title: "", content: "" });
    setIsEditing(true);
    setSelectedNoteId(null);
  }

  // PUBLIC_INTERFACE
  function handleEditNote() {
    setIsEditing(true);
    const note = notes.find((n) => n.id === selectedNoteId);
    setMainViewForm({
      title: note ? note.title : "",
      content: note ? note.content : "",
    });
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(noteId) {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This cannot be undone."
      )
    ) {
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      setNotes(updatedNotes);
      setIsEditing(false);
      if (updatedNotes.length > 0) {
        setSelectedNoteId(updatedNotes[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleMainViewChange(e) {
    const { name, value } = e.target;
    setMainViewForm((f) => ({ ...f, [name]: value }));
  }

  // PUBLIC_INTERFACE
  function handleSaveNote(e) {
    e.preventDefault();
    const { title, content } = mainViewForm;
    if (!title.trim() && !content.trim()) {
      alert("Note cannot be empty.");
      return;
    }
    let newNotes;
    if (selectedNoteId !== null && notes.find((n) => n.id === selectedNoteId)) {
      // update existing note
      newNotes = notes.map((n) =>
        n.id === selectedNoteId
          ? { ...n, title, content, updated: Date.now() }
          : n
      );
    } else {
      // create new note
      const id = Date.now().toString();
      newNotes = [
        { id, title, content, updated: Date.now() },
        ...notes,
      ];
      setSelectedNoteId(id);
    }
    setNotes(newNotes);
    setIsEditing(false);
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setIsEditing(false);
    const note = notes.find((n) => n.id === selectedNoteId);
    setMainViewForm({
      title: note ? note.title : "",
      content: note ? note.content : "",
    });
  }

  // Get selected note object
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // Date formatting helper
  function prettifyDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleString();
  }

  // Minimal topbar
  const Topbar = (
    <header
      style={{
        background: colors.primary,
        color: "#fff",
        padding: "1rem 2rem",
        fontWeight: 600,
        fontSize: "1.3rem",
        letterSpacing: ".03em",
        borderBottom: `2px solid ${colors.accent}`,
        height: "3rem",
        minHeight: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      Personal Notes
      <span style={{ color: colors.accent, fontWeight: 700, fontSize: "1.1rem" }}>
        📝
      </span>
    </header>
  );

  // Sidebar with notes + "new" button
  const Sidebar = (
    <aside
      style={{
        background: colors.sidebar,
        borderRight: `1px solid ${colors.border}`,
        padding: "0.75rem 0.5rem",
        height: "calc(100vh - 3rem)",
        minWidth: 230,
        width: 260,
        transition: "width 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <button
        style={{
          background: colors.primary,
          color: "#fff",
          padding: "0.5rem 1.1rem",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "1rem",
          marginBottom: ".5rem",
          cursor: "pointer",
          boxShadow: "0 2px 4px #0001",
          outline: "none",
        }}
        onClick={handleCreateNote}
        aria-label="New note"
      >
        + New Note
      </button>
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "100%",
          marginRight: "-6px",
        }}
        aria-label="Notes list"
      >
        {notes.length === 0 && (
          <div style={{
            color: colors.secondary,
            padding: "1rem",
            fontSize: ".98rem",
            textAlign: "center",
            opacity: 0.55,
          }}>
            No notes yet.
          </div>
        )}
        {notes.map((note) => (
          <div
            tabIndex={0}
            aria-label={note.title || "Untitled Note"}
            key={note.id}
            onClick={() => handleNoteSelect(note.id)}
            onKeyPress={e => { if (e.key === "Enter") handleNoteSelect(note.id); }}
            style={{
              background: note.id === selectedNoteId ? colors.sidebarActive : "transparent",
              borderRadius: 8,
              padding: "0.62rem 0.85rem",
              margin: "2px 0",
              marginRight: "3px",
              cursor: "pointer",
              fontWeight: note.id === selectedNoteId ? 700 : 500,
              color: note.id === selectedNoteId ? colors.primary : colors.secondary,
              border: note.id === selectedNoteId
                ? `1.5px solid ${colors.primary}` : "1.5px solid transparent",
              boxShadow: note.id === selectedNoteId ? "0 2px 6px #1976d215" : "none",
              transition: "background .15s, border .13s",
              outline: "none",
            }}
          >
            <div
              style={{
                fontSize: "1rem",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                maxWidth: 175,
              }}
            >
              {note.title?.trim() ? note.title.slice(0, 36) : <span style={{ fontStyle: "italic", color: "#999" }}>Untitled</span>}
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                color: colors.secondary,
                marginTop: 2,
              }}
            >
              <span style={{ fontSize: "0.81em", color: "#bbb" }}>
                {prettifyDate(note.updated)}
              </span>
              <button
                tabIndex={-1}
                aria-label="Delete note"
                onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  color: "#cc2222",
                  cursor: "pointer",
                  fontSize: "0.92rem",
                  padding: 0,
                  opacity: 0.65,
                  float: "right"
                }}
                title="Delete note"
              >🗑️</button>
            </div>
          </div>
        ))}
      </nav>
      <div style={{ fontSize: "0.83rem", color: "#bbb", textAlign: "right", marginRight: "0.5rem" }}>
        {notes.length} note{notes.length !== 1 ? "s" : ""}
      </div>
    </aside>
  );

  // Main note view/edit area
  const MainView = (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        background: colors.background,
        padding: "2.2rem 2.4rem 1.1rem 2.4rem",
        height: "calc(100vh - 3rem)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Note Editing Form */}
      {isEditing ? (
        <form
          style={{
            maxWidth: 530,
            width: "100%",
            background: "#fff",
            boxShadow: "0 4px 20px #0002",
            borderRadius: 12,
            padding: "1.5rem 2rem 1.2rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.3rem",
            margin: "0 auto",
          }}
          onSubmit={handleSaveNote}
        >
          <label htmlFor="title" style={{ fontWeight: "600", color: colors.primary, fontSize: "1.15rem" }}>
            Title
          </label>
          <input
            id="title"
            name="title"
            autoFocus
            maxLength={70}
            type="text"
            placeholder="Note title"
            value={mainViewForm.title}
            onChange={handleMainViewChange}
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              padding: "0.68rem 0.9rem",
              border: `1.5px solid ${colors.border}`,
              borderRadius: 7,
              marginBottom: "0.45rem",
              outlineColor: colors.primary,
              background: "#f8fafe",
              color: colors.secondary,
            }}
          />
          <label htmlFor="content" style={{ fontWeight: 500, color: colors.secondary }}>
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Start typing your note..."
            rows={10}
            value={mainViewForm.content}
            onChange={handleMainViewChange}
            style={{
              fontSize: "1.11rem",
              fontFamily: "inherit",
              lineHeight: "1.65",
              padding: "0.65rem 0.9rem",
              border: `1.5px solid ${colors.border}`,
              borderRadius: 8,
              background: "#f8fafe",
              color: "#222",
              resize: "vertical",
              minHeight: 150,
              maxHeight: 450,
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.8rem" }}>
            <button
              type="button"
              style={{
                background: "#fafbfc",
                color: colors.secondary,
                fontWeight: 500,
                border: `1px solid ${colors.accent}`,
                borderRadius: 7,
                padding: "0.55rem 1.35rem",
                cursor: "pointer",
                transition: "background .19s",
              }}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: colors.primary,
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: 7,
                padding: "0.55rem 1.35rem",
                cursor: "pointer",
                boxShadow: `0 2px 6px ${colors.primary}35`,
                transition: "background .17s",
              }}
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        // Note display area
        <div
          style={{
            maxWidth: 540,
            width: "100%",
            margin: "0 auto",
            background: "#fff",
            boxShadow: "0 4px 20px #0001",
            borderRadius: 13,
            padding: "2.2rem 2.25rem 1rem 2.2rem",
            minHeight: 160,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedNote ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: 0, color: colors.primary, fontWeight: 700, fontSize: "2rem", marginBottom: 6, wordBreak: "break-word" }}>
                    {selectedNote.title?.trim() || <span style={{ color: "#aaa", fontStyle: "italic" }}>Untitled note</span>}
                  </h2>
                  <div style={{ color: colors.secondary, fontSize: "0.98rem", marginBottom: 18 }}>
                    <span style={{ fontSize: "0.89em", color: "#888" }}>
                      Updated: {prettifyDate(selectedNote.updated)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleEditNote}
                  style={{
                    background: colors.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 7,
                    padding: "0.49rem 1.1rem",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    marginLeft: "0.5rem",
                    boxShadow: `0 1px 4px ${colors.accent}23`,
                  }}
                  aria-label="Edit note"
                  title="Edit note"
                >
                  Edit
                </button>
              </div>
              <div
                style={{
                  color: "#222",
                  fontSize: "1.13rem",
                  padding: "0.6rem 3px 0 0",
                  minHeight: 80,
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  marginBottom: 6,
                }}
              >
                {selectedNote.content?.trim()
                  ? selectedNote.content
                  : <span style={{ fontStyle: "italic", color: "#eee" }}>No content</span>}
              </div>
            </>
          ) : notes.length === 0 ? (
            <div style={{
              margin: "2.5rem auto 0 auto",
              textAlign: "center",
              color: colors.secondary,
              opacity: 0.75,
              fontSize: "1.2rem"
            }}>
              Your notes will appear here.<br />
              Click <strong>+ New Note</strong> to get started!
            </div>
          ) : (
            <div style={{
              margin: "3rem auto 0 auto",
              textAlign: "center",
              color: "#999",
              fontStyle: "italic"
            }}>
              Select a note from the sidebar to view.
            </div>
          )}
        </div>
      )}
    </main>
  );

  // RESPONSIVE LAYOUT HACK: show sidebar above content on mobile
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {Topbar}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "calc(100vh - 3rem)",
        }}
        className="main-body"
      >
        {Sidebar}
        {MainView}
      </div>
      <style>
        {`
          @media (max-width: 900px) {
            .main-body {
              flex-direction: column;
            }
            aside {
              flex-direction: row !important;
              width: 100vw !important;
              min-width: 0 !important;
              height: auto !important;
              border-right: none !important;
              border-bottom: 1.5px solid #eee !important;
              margin: 0;
              overflow-x: auto;
              overflow-y: visible !important;
              gap: 0.55rem !important;
              padding: 0.4rem .2rem !important;
            }
            main {
              padding: 1.1rem 2vw 1.15rem 2vw !important;
            }
          }
          @media (max-width: 600px) {
            aside {
              padding: 0.2rem !important;
            }
            main {
              padding: .3rem 0.7rem 1.2rem 0.7rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;
