const bcrypt = require("bcrypt");
const prisma = require("../prismaClient");

const getLibrarians = async (req, res, next) => {
  try {
    const librarians = await prisma.librarian.findMany();
    res.json(librarians);
  } catch (error) {
    next(error);
  }
};

const getLibrarianById = async (req, res, next) => {
  try {
    const librarian_id = parseInt(req.params.id, 10);
    const librarian = await prisma.librarian.findUnique({ where: { librarian_id } });
    if (!librarian) return res.status(404).json({ error: "Librarian not found" });
    res.json(librarian);
  } catch (error) {
    next(error);
  }
};

const createLibrarian = async (req, res, next) => {
  try {
    const { name, email, phone, shift_time, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const librarian = await prisma.librarian.create({
      data: { name, email, phone, shift_time, password: hashedPassword },
    });
    res.status(201).json(librarian);
  } catch (error) {
    next(error);
  }
};

const updateLibrarian = async (req, res, next) => {
  try {
    const librarian_id = parseInt(req.params.id, 10);
    const data = { ...req.body };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const librarian = await prisma.librarian.update({ where: { librarian_id }, data });
    res.json(librarian);
  } catch (error) {
    next(error);
  }
};

const deleteLibrarian = async (req, res, next) => {
  try {
    const librarian_id = parseInt(req.params.id, 10);
    await prisma.librarian.delete({ where: { librarian_id } });
    res.json({ message: "Librarian deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLibrarians, getLibrarianById, createLibrarian, updateLibrarian, deleteLibrarian };
