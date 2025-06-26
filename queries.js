// Connect to the correct database
//use plp_bookstore;

// --- Basic Queries ---

// 1. Find all books in the genre "Fiction"
db.books.find({ genre: "Fiction" });

// 2. Find books published after the year 2000
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by author "George Orwell"
db.books.find({ author: "George Orwell" });

// 4. Update the price of "1984" to 13.99
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 13.99 } }
);

// 5. Delete a book titled "Moby Dick"
db.books.deleteOne({ title: "Moby Dick" });


// --- Advanced Queries ---

// 6. Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 7. Projection: Only show title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// 8. Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// 9. Sort books by price (descending)
db.books.find().sort({ price: -1 });

// 10. Pagination: First page (5 books)
db.books.find().skip(0).limit(5);

// 11. Pagination: Second page (next 5 books)
db.books.find().skip(5).limit(5);


// --- Aggregation Pipelines ---

// 12. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// 13. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 14. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
      count: 1,
      _id: 0
    }
  },
  { $sort: { decade: 1 } }
]);


// --- Indexing ---

// 15. Create index on title
db.books.createIndex({ title: 1 });

// 16. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 17. Use explain() to show performance improvement
db.books.find({ title: "The Hobbit" }).explain("executionStats");
