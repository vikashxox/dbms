const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getLibrarians, getLibrarianById, createLibrarian, updateLibrarian, deleteLibrarian } = require("../controllers/librarianController");

router.use(authenticateToken);
router.get("/", authorizeRoles("librarian"), getLibrarians);
router.get("/:id", authorizeRoles("librarian"), getLibrarianById);
router.post("/", authorizeRoles("librarian"), createLibrarian);
router.put("/:id", authorizeRoles("librarian"), updateLibrarian);
router.delete("/:id", authorizeRoles("librarian"), deleteLibrarian);

module.exports = router;
