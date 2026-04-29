const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getPublishers, getPublisherById, createPublisher, updatePublisher, deletePublisher } = require("../controllers/publisherController");

router.use(authenticateToken);
router.get("/", authorizeRoles("librarian", "member"), getPublishers);
router.get("/:id", authorizeRoles("librarian", "member"), getPublisherById);
router.post("/", authorizeRoles("librarian"), createPublisher);
router.put("/:id", authorizeRoles("librarian"), updatePublisher);
router.delete("/:id", authorizeRoles("librarian"), deletePublisher);

module.exports = router;
