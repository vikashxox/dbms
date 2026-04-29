const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getBorrows, getBorrowById, issueBook, returnBook, updateBorrow, deleteBorrow } = require("../controllers/borrowController");

router.use(authenticateToken);
router.get("/", authorizeRoles("librarian", "member"), getBorrows);
router.get("/:id", authorizeRoles("librarian", "member"), getBorrowById);
router.post("/", authorizeRoles("librarian"), issueBook);
router.post("/:id/return", authorizeRoles("librarian", "member"), returnBook);
router.put("/:id", authorizeRoles("librarian"), updateBorrow);
router.delete("/:id", authorizeRoles("librarian"), deleteBorrow);

module.exports = router;
