const prisma = require("../prismaClient");

const getAuthors = async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany({ include: { writtenBooks: { include: { book: true } } } });
    res.json(authors);
  } catch (error) {
    next(error);
  }
};

const getAuthorById = async (req, res, next) => {
  try {
    const author_id = parseInt(req.params.id, 10);
    const author = await prisma.author.findUnique({
      where: { author_id },
      include: { writtenBooks: { include: { book: true } } },
    });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.json(author);
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const { author_name, author_email, address } = req.body;
    const author = await prisma.author.create({ data: { author_name, author_email, address } });
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const author_id = parseInt(req.params.id, 10);
    const author = await prisma.author.update({ where: { author_id }, data: req.body });
    res.json(author);
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const author_id = parseInt(req.params.id, 10);
    
    await prisma.$transaction([
      prisma.writtenBy.deleteMany({ where: { author_id } }),
      prisma.author.delete({ where: { author_id } })
    ]);
    
    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
