const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const exists = users.filter((user) => user.username === username);
    if (exists.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Provide username and password." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const filteredBooks = keys
    .filter(key => books[key].author === author)
    .map(key => books[key]);
  
  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const filteredBooks = keys
    .filter(key => books[key].title === title)
    .map(key => books[key]);

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// --- ASYNC / PROMISE SECTION (Tasks 10-13) ---

// Task 10: Get all books using Async/Await
public_users.get('/async-books', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getBooks();
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    res.status(500).send(err);
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async-isbn/:isbn', function (req, res) {
  const getBookByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  });

  getBookByISBN
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).send(err));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/async-author/:author', function (req, res) {
  const getByAuthor = new Promise((resolve, reject) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    const filtered = keys.filter(k => books[k].author === author).map(k => books[k]);
    if (filtered.length > 0) resolve(filtered);
    else reject("Author not found");
  });

  getByAuthor
    .then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).send(err));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/async-title/:title', function (req, res) {
  const getByTitle = new Promise((resolve, reject) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    const filtered = keys.filter(k => books[k].title === title).map(k => books[k]);
    if (filtered.length > 0) resolve(filtered);
    else reject("Title not found");
  });

  getByTitle
    .then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).send(err));
});

module.exports.general = public_users;