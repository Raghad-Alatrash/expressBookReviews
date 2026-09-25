const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// User Registration Endpoint
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async-Await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Helper function returning a Promise that resolves with the full books list
    const fetchBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("Unable to fetch books");
        }
      });
    };

    // Await the resolution of the Promise
    const allBooks = await fetchBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: error});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Create a Promise to retrieve book details by ISBN
  const fetchBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found for the provided ISBN");
    }
  });

  // Handle Promise resolution and rejection
  fetchBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({message: err});
    });
});

// Task 12: Get book details based on Author using Promises / Async filtering
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author;

  // Create a Promise to filter books by author name
  const fetchBooksByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);

    // Iterate through all books and check matching author
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === authorParam.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for the specified author");
    }
  });

  // Handle Promise callback response
  fetchBooksByAuthor
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({message: err});
    });
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title;

  // Create a Promise to filter books by title
  const fetchBooksByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);

    // Filter books matching the requested title
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === titleParam.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with the specified title");
    }
  });

  // Resolve Promise and handle HTTP status response
  fetchBooksByTitle
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({message: err});
    });
});

// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;