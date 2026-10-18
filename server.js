const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const BOOKS_FILE = path.join(__dirname, "data", "books.json");
const NOTES_FILE = path.join(__dirname, "data", "notes.json");

function createSummary(opening, lessons) {
    const words = opening.trim().split(/\s+/);
    let lessonIndex = 0;

    while (words.length < 1900) {
        const lesson = lessons[lessonIndex % lessons.length];
        words.push(...lesson.split(/\s+/));
        lessonIndex += 1;
    }

    return words.slice(0, 1900).join(" ");
}

const starterBooks = [
    {
        id: 1,
        title: "The Human Brain",
        category: "Science",
        author: "EduShelf",
        description: "Learn the basics of how the human brain works.",
        readTime: "8 min",
        content: createSummary("The human brain is the control center of the body. It helps us think, learn, remember, move, and understand the world around us. Billions of nerve cells communicate through tiny electrical and chemical signals. Different areas have different jobs, but they work together as one connected system. The brain also changes as we learn. This ability, called neuroplasticity, means practice and experience can strengthen connections between nerve cells. Sleep, movement, nourishing food, and curiosity all support healthy brain function. Studying the brain helps us understand both the remarkable abilities people share and the many ways every person is unique.", [
            "Neurons are specialized cells that carry information. They receive messages through branching dendrites and send messages along an axon. At a tiny gap called a synapse, chemical messengers carry the signal to another cell. This communication happens incredibly quickly and allows the nervous system to coordinate thought, sensation, movement, and internal functions.",
            "The cerebrum is the largest part of the brain. Its outer layer, the cerebral cortex, is divided into areas that contribute to language, planning, vision, hearing, touch, and voluntary movement. The two hemispheres communicate through bundles of nerve fibers, so many tasks depend on cooperation rather than one isolated location.",
            "The brain does not work alone. The spinal cord and peripheral nerves carry information between the brain and the rest of the body. Sensory signals report temperature, pressure, sound, light, and the position of muscles. Motor signals guide muscles and glands. This constant exchange lets a person respond to a changing environment.",
            "Learning changes the strength of connections between neurons. Repetition, attention, feedback, and meaningful practice can make a skill easier to perform. Forgetting is also useful because it helps the brain focus on important information. Good learning combines effort with rest, reflection, and opportunities to use knowledge in new situations.",
            "Memory has several forms. Working memory holds a small amount of information for immediate use. Long term memory stores facts, events, skills, and habits. Attention helps information enter memory, while sleep helps stabilize what was learned. Connecting a new idea to something familiar can make recall more reliable.",
            "Emotions influence attention and decision making. Brain systems related to danger can prepare the body to act, while systems involved in reward can encourage useful behavior. Emotions are not the opposite of reason. They provide information, and thoughtful decisions often improve when feelings are recognized and considered carefully.",
            "Sleep gives the brain time to organize information and restore the body. Regular physical activity supports circulation and can improve mood and concentration. A balanced diet supplies energy and materials for cells. Social connection, creative activity, and time outdoors can also support mental health and resilience.",
            "Brain science is still developing. Researchers use observation, experiments, brain imaging, and careful comparisons to learn how the nervous system works. Every study has limits, so responsible science distinguishes evidence from speculation. Understanding the brain encourages curiosity, patience, and respect for the differences between individuals."
        ])
    },
    {
        id: 2,
        title: "The Roman Empire",
        category: "History",
        author: "EduShelf",
        description: "A short introduction to the Roman Empire.",
        readTime: "10 min",
        content: createSummary("The Roman Empire grew from a city on the Italian peninsula into one of the largest states of the ancient world. Roman armies, roads, laws, language, and trade connected many different peoples across Europe, North Africa, and western Asia. Roman leaders built cities, bridges, public baths, and forums, while writers and engineers left ideas that still influence the modern world. Life in the empire was unequal: citizens, enslaved people, soldiers, merchants, and rulers had very different experiences. Political conflict, economic pressure, invasions, and the empire’s huge size eventually weakened its western government. Even after its fall in the West, Roman culture continued to shape history.", [
            "Rome began as a community in central Italy and gradually expanded through alliances, diplomacy, and war. The republic developed elected offices and a senate, although political power remained concentrated among wealthy families. Competition between ambitious leaders eventually caused civil wars. Augustus became the first emperor and established a new political order while preserving many older republican traditions in appearance.",
            "The empire was held together by administration as much as by military force. Provinces paid taxes, supplied soldiers, and followed Roman decisions, but local communities often kept their languages, customs, and religious practices. Governors, judges, merchants, and city councils connected local life to imperial authority. Citizenship expanded over time and eventually reached nearly all free inhabitants.",
            "Roman soldiers built forts, roads, bridges, and frontier walls. The army protected borders, but it also moved people, ideas, and goods across long distances. Service could provide pay, status, and a path to citizenship. Veterans sometimes received land or settled in new communities, helping spread Roman institutions beyond Italy.",
            "Cities were important centers of Roman life. Public buildings displayed wealth and power, while markets, workshops, temples, baths, theaters, and arenas created places for business and social activity. Aqueducts carried water across difficult terrain. Sewers and public fountains improved urban life, although crowded housing, fires, disease, and poverty remained serious problems.",
            "The Roman economy depended on agriculture, trade, taxation, and labor. Grain, olive oil, wine, metals, textiles, and pottery moved through ports and along roads. Enslaved people performed domestic, agricultural, mining, and skilled work, and their lack of freedom was a central injustice of Roman society. Wealth was distributed very unevenly.",
            "Roman law developed through customs, written statutes, court decisions, and legal interpretation. It addressed property, contracts, family relationships, citizenship, and crime. Roman legal ideas were not equal by modern standards, but later societies studied them because they offered organized ways to define rights, duties, and procedures.",
            "Religion was woven into public and private life. Families honored household gods, cities held ceremonies, and emperors could be treated as symbols of loyalty. The empire also contained many religious traditions. Judaism, Christianity, mystery religions, and local beliefs grew and changed within this diverse world. Christianity moved from a persecuted minority to an imperial religion.",
            "The western empire faced pressure from political instability, economic problems, military conflicts, and movements of peoples across its borders. There was no single cause of decline. Different regions experienced change at different speeds. In the fifth century, western imperial rule weakened, while the eastern Roman Empire continued for many centuries from Constantinople.",
            "Rome’s legacy can be seen in languages derived from Latin, legal traditions, architecture, engineering, literature, government, calendars, and roads. Studying the empire also means studying its contradictions: impressive achievements existed alongside conquest, slavery, inequality, and violence. History becomes more useful when it remembers both the accomplishments and the human costs."
        ])
    }
];

function loadBooks() {
    try {
        const savedBooks = JSON.parse(fs.readFileSync(BOOKS_FILE, "utf8"));
        if (!Array.isArray(savedBooks)) {
            throw new Error("Saved books must be a JSON array.");
        }
        return savedBooks;
    } catch (error) {
        if (error.code === "ENOENT") return [...starterBooks];
        throw error;
    }
}

function saveBooks(booksToSave) {
    fs.mkdirSync(path.dirname(BOOKS_FILE), { recursive: true });
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(booksToSave, null, 2), "utf8");
}

let books = loadBooks();

function loadNotes() {
    try {
        const savedNotes = JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
        if (!Array.isArray(savedNotes)) {
            throw new Error("Saved notes must be a JSON array.");
        }
        return savedNotes;
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

function saveNotes(notesToSave) {
    fs.mkdirSync(path.dirname(NOTES_FILE), { recursive: true });
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notesToSave, null, 2), "utf8");
}

let notes = loadNotes();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
    res.json(notes);
});

app.post("/api/notes", (req, res) => {
    const body = req.body || {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) {
        return res.status(400).json({ error: "Write something in your note before saving." });
    }
    if (title.length > 120) {
        return res.status(400).json({ error: "Note titles must be 120 characters or fewer." });
    }

    const note = {
        id: Math.max(Date.now(), ...notes.map((item) => Number(item.id) + 1).filter(Number.isFinite)),
        title,
        content,
        updatedAt: new Date().toISOString()
    };
    const updatedNotes = [note, ...notes];
    try {
        saveNotes(updatedNotes);
    } catch (error) {
        console.error("Could not save note:", error);
        return res.status(500).json({ error: "Note could not be saved. Please try again." });
    }
    notes = updatedNotes;
    res.status(201).json(note);
});

app.put("/api/notes/:id", (req, res) => {
    const noteIndex = notes.findIndex((item) => String(item.id) === req.params.id);
    if (noteIndex === -1) return res.status(404).json({ error: "Note not found." });

    const body = req.body || {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) {
        return res.status(400).json({ error: "Write something in your note before saving." });
    }
    if (title.length > 120) {
        return res.status(400).json({ error: "Note titles must be 120 characters or fewer." });
    }

    const updatedNote = { ...notes[noteIndex], title, content, updatedAt: new Date().toISOString() };
    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = updatedNote;
    try {
        saveNotes(updatedNotes);
    } catch (error) {
        console.error("Could not update note:", error);
        return res.status(500).json({ error: "Note could not be saved. Please try again." });
    }
    notes = updatedNotes;
    res.json(updatedNote);
});

app.delete("/api/notes/:id", (req, res) => {
    const updatedNotes = notes.filter((item) => String(item.id) !== req.params.id);
    if (updatedNotes.length === notes.length) {
        return res.status(404).json({ error: "Note not found." });
    }
    try {
        saveNotes(updatedNotes);
    } catch (error) {
        console.error("Could not delete note:", error);
        return res.status(500).json({ error: "Note could not be deleted. Please try again." });
    }
    notes = updatedNotes;
    res.json({ success: true });
});

app.get("/api/books", (req, res) => {
    res.json(books);
});

app.get("/api/books/:id", (req, res) => {
    const book = books.find((item) => String(item.id) === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found." });
    res.json(book);
});

app.post("/api/books", (req, res) => {
    const { title, category, author, content } = req.body;
    const words = typeof content === "string" ? content.trim().split(/\s+/).filter(Boolean) : [];

    if (!title?.trim() || !category?.trim() || !author?.trim() || words.length === 0) {
        return res.status(400).json({ error: "Title, category, author, and book text are required." });
    }

    if (words.length > 2000) {
        return res.status(400).json({ error: "Books must be 2,000 words or fewer." });
    }

    const book = {
        id: Math.max(Date.now(), ...books.map((item) => Number(item.id) + 1).filter(Number.isFinite)),
        title: title.trim(),
        category: category.trim(),
        author: author.trim(),
        description: words.slice(0, 24).join(" ") + (words.length > 24 ? "..." : ""),
        readTime: `${Math.max(1, Math.ceil(words.length / 200))} min`,
        content: content.trim()
    };

    const updatedBooks = [...books, book];
    try {
        saveBooks(updatedBooks);
    } catch (error) {
        console.error("Could not save published book:", error);
        return res.status(500).json({ error: "Book could not be saved. Please try again." });
    }
    books = updatedBooks;
    res.status(201).json(book);
});

app.listen(PORT, () => {
    console.log(`wrightnote is running at http://localhost:${PORT}`);
});