const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if the username is valid (not already taken)
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length === 0;
};

// Helper function to check if username and password match the records
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in: Username and password required" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT Access Token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization.username;

    if (books[isbn]) {
        // Assign the review to the username for that specific book
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "The review for the book with ISBN " + isbn + " has been added/updated." });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization.username;

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review for the ISBN " + isbn + " posted by user " + username + " deleted." });
        } else {
            return res.status(404).json({ message: "No review found for this user to delete" });
        }
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;