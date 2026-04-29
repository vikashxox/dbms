const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getMembers, getMemberById, createMember, updateMember, deleteMember } = require("../controllers/memberController");

router.use(authenticateToken);
router.get("/", authorizeRoles("librarian"), getMembers);
router.get("/:id", authorizeRoles("librarian", "member"), getMemberById);
router.post("/", authorizeRoles("librarian"), createMember);
router.put("/:id", authorizeRoles("librarian", "member"), updateMember);
router.delete("/:id", authorizeRoles("librarian"), deleteMember);

module.exports = router;
