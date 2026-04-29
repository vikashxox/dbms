const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/bookController");

router.use(authenticateToken);
router.get("/", authorizeRoles("librarian", "member"), getBooks);
router.get("/:id", authorizeRoles("librarian", "member"), getBookById);
router.post("/", authorizeRoles("librarian"), createBook);
router.put("/:id", authorizeRoles("librarian"), updateBook);
router.delete("/:id", authorizeRoles("librarian"), deleteBook);

module.exports = router;
