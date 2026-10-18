const notesList = document.getElementById("notesList");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const saveStatus = document.getElementById("saveStatus");
const saveButton = document.getElementById("saveNote");
const deleteButton = document.getElementById("deleteNote");
const themeToggle = document.getElementById("themeToggle");
let notes = [];
let currentNoteId = null;
let savedTitle = "";
let savedContent = "";

function updateThemeToggle() {
    const darkModeEnabled = document.body.classList.contains("dark-mode");
    themeToggle.textContent = darkModeEnabled ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-pressed", String(darkModeEnabled));
}

document.body.classList.toggle("dark-mode", localStorage.getItem("writeright-theme") === "dark");
updateThemeToggle();
themeToggle.addEventListener("click", () => {
    const darkModeEnabled = document.body.classList.toggle("dark-mode");
    localStorage.setItem("writeright-theme", darkModeEnabled ? "dark" : "light");
    updateThemeToggle();
});

function isDirty() {
    return titleInput.value !== savedTitle || contentInput.value !== savedContent;
}

function getNoteTitle(note) {
    return note.title || note.content.split(/\r?\n/, 1)[0].trim() || "Untitled note";
}

function renderNotes() {
    notesList.replaceChildren();
    if (notes.length === 0) {
        const empty = document.createElement("p");
        empty.className = "notes-empty";
        empty.textContent = "Your saved notes will show up here.";
        notesList.appendChild(empty);
        return;
    }

    notes.forEach((note) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "note-list-item";
        button.classList.toggle("active", note.id === currentNoteId);
        button.setAttribute("aria-current", note.id === currentNoteId ? "true" : "false");

        const title = document.createElement("span");
        title.className = "note-list-title";
        title.textContent = getNoteTitle(note);
        const preview = document.createElement("span");
        preview.className = "note-list-preview";
        preview.textContent = note.content;
        button.append(title, preview);
        button.addEventListener("click", () => openNote(note));
        notesList.appendChild(button);
    });
}

function openNote(note) {
    if (isDirty() && !window.confirm("Discard your unsaved changes and open this note?")) return;
    currentNoteId = note.id;
    titleInput.value = note.title;
    contentInput.value = note.content;
    savedTitle = note.title;
    savedContent = note.content;
    deleteButton.hidden = false;
    saveStatus.textContent = "Note saved.";
    renderNotes();
    contentInput.focus();
}

function startNewNote() {
    if (isDirty() && !window.confirm("Discard your unsaved changes and start a new note?")) return;
    currentNoteId = null;
    titleInput.value = "";
    contentInput.value = "";
    savedTitle = "";
    savedContent = "";
    deleteButton.hidden = true;
    saveStatus.textContent = "A new note is ready.";
    renderNotes();
    titleInput.focus();
}

function updateEditingStatus() {
    saveStatus.textContent = isDirty() ? "Unsaved changes." : (currentNoteId === null ? "A new note is ready." : "Note saved.");
}

async function loadNotes() {
    try {
        const response = await fetch("/api/notes");
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load your notes.");
        notes = result;
        renderNotes();
        saveStatus.textContent = notes.length ? "Select a note or start writing." : "Start writing whenever you're ready.";
        contentInput.focus();
    } catch (error) {
        notesList.textContent = "Your notes could not be loaded. Please refresh to try again.";
        saveStatus.textContent = error.message;
    }
}

async function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!content) {
        saveStatus.textContent = "Write something in your note before saving.";
        contentInput.focus();
        return;
    }

    saveButton.disabled = true;
    saveStatus.textContent = "Saving...";
    try {
        const isUpdating = currentNoteId !== null;
        const response = await fetch(isUpdating ? `/api/notes/${encodeURIComponent(currentNoteId)}` : "/api/notes", {
            method: isUpdating ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not save your note.");

        currentNoteId = result.id;
        titleInput.value = result.title;
        contentInput.value = result.content;
        savedTitle = result.title;
        savedContent = result.content;
        const existingIndex = notes.findIndex((note) => note.id === result.id);
        if (existingIndex === -1) notes.unshift(result);
        else notes[existingIndex] = result;
        deleteButton.hidden = false;
        saveStatus.textContent = "Note saved.";
        renderNotes();
    } catch (error) {
        saveStatus.textContent = error.message;
    } finally {
        saveButton.disabled = false;
    }
}

async function deleteNote() {
    if (currentNoteId === null || !window.confirm("Delete this note? This cannot be undone.")) return;
    deleteButton.disabled = true;
    try {
        const response = await fetch(`/api/notes/${encodeURIComponent(currentNoteId)}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not delete this note.");
        notes = notes.filter((note) => note.id !== currentNoteId);
        currentNoteId = null;
        titleInput.value = "";
        contentInput.value = "";
        savedTitle = "";
        savedContent = "";
        deleteButton.hidden = true;
        saveStatus.textContent = "Note deleted.";
        renderNotes();
    } catch (error) {
        saveStatus.textContent = error.message;
    } finally {
        deleteButton.disabled = false;
    }
}

document.getElementById("newNote").addEventListener("click", startNewNote);
saveButton.addEventListener("click", saveNote);
deleteButton.addEventListener("click", deleteNote);
titleInput.addEventListener("input", () => {
    updateEditingStatus();
});
contentInput.addEventListener("input", () => {
    updateEditingStatus();
});

loadNotes();
