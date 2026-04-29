const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require("../controllers/authorController");

router.use(authenticateToken);
router.get("/", authorizeRoles("librarian", "member"), getAuthors);
router.get("/:id", authorizeRoles("librarian", "member"), getAuthorById);
router.post("/", authorizeRoles("librarian"), createAuthor);
router.put("/:id", authorizeRoles("librarian"), updateAuthor);
router.delete("/:id", authorizeRoles("librarian"), deleteAuthor);

module.exports = router;
