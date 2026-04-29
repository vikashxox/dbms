const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const memberRoutes = require("./routes/memberRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const librarianRoutes = require("./routes/librarianRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/librarians", librarianRoutes);
app.use("/api/borrows", borrowRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Library Management API is running." });
});

app.use(errorHandler);

module.exports = app;
