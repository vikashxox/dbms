const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
};

const registerMember = async (req, res, next) => {
  try {
    const { first_name, middle_name, last_name, year, department, phone, email, address, status, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await prisma.member.create({
      data: {
        first_name,
        middle_name,
        last_name,
        year,
        department,
        phone,
        email,
        address,
        status: status || "active",
        password: hashedPassword,
      },
    });

    const { password: _password, ...payload } = member;
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const user =
      role === "librarian"
        ? await prisma.librarian.findUnique({ where: { email } })
        : await prisma.member.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id: role === "librarian" ? user.librarian_id : user.member_id, role, email });
    res.json({ token, user: { id: role === "librarian" ? user.librarian_id : user.member_id, email, role } });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerMember, login };
