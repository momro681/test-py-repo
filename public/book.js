const bookContent = document.getElementById("bookContent");
const themeToggle = document.getElementById("themeToggle");

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

function showMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "reader-message";
    paragraph.textContent = message;
    bookContent.replaceChildren(paragraph);
}

function renderBook(book) {
    const reader = document.createElement("article");
    reader.className = "book-reader";

    const category = document.createElement("p");
    category.className = "eyebrow";
    category.textContent = book.category;

    const title = document.createElement("h1");
    title.textContent = book.title;

    const meta = document.createElement("p");
    meta.className = "reader-meta";
    meta.textContent = `${book.author} | ${book.readTime} read`;

    const content = document.createElement("p");
    content.className = "reader-content";
    content.textContent = book.content;

    reader.append(category, title, meta, content);
    bookContent.replaceChildren(reader);
    document.title = `${book.title} | wrightnote`;
}

async function loadBook() {
    const bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) {
        showMessage("This book could not be found.");
        return;
    }

    try {
        const response = await fetch(`/api/books/${encodeURIComponent(bookId)}`);
        if (response.status === 404) {
            showMessage("This book could not be found.");
            return;
        }
        if (!response.ok) throw new Error("Could not load this book.");
        renderBook(await response.json());
    } catch (error) {
        showMessage(error.message);
    }
}

loadBook();