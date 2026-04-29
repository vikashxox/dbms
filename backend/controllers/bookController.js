const prisma = require("../prismaClient");

const getBooks = async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        publisher: true,
        librarian: true,
        authors: { include: { author: true } },
      },
    });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book_id = parseInt(req.params.id, 10);
    const book = await prisma.book.findUnique({
      where: { book_id },
      include: {
        publisher: true,
        librarian: true,
        authors: { include: { author: true } },
      },
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, isbn, edition, category, language, price, shelf_location, publisher_id, librarian_id, authorIds } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        isbn,
        edition,
        category,
        language,
        price: parseFloat(price),
        shelf_location,
        publisher: { connect: { publisher_id: parseInt(publisher_id, 10) } },
        librarian: { connect: { librarian_id: parseInt(librarian_id, 10) } },
        authors: {
          create: authorIds ? authorIds.map((authorId) => ({ author: { connect: { author_id: parseInt(authorId, 10) } } })) : [],
        },
      },
      include: { publisher: true, librarian: true, authors: { include: { author: true } } },
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book_id = parseInt(req.params.id, 10);
    const { authorIds, ...data } = req.body;

    const updateData = { ...data };
    if (data.publisher_id) {
      updateData.publisher = { connect: { publisher_id: parseInt(data.publisher_id, 10) } };
      delete updateData.publisher_id;
    }
    if (data.librarian_id) {
      updateData.librarian = { connect: { librarian_id: parseInt(data.librarian_id, 10) } };
      delete updateData.librarian_id;
    }
    if (authorIds) {
      updateData.authors = {
        deleteMany: {},
        create: authorIds.map((authorId) => ({ author: { connect: { author_id: parseInt(authorId, 10) } } })),
      };
    }

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const book = await prisma.book.update({
      where: { book_id },
      data: updateData,
      include: { publisher: true, librarian: true, authors: { include: { author: true } } },
    });
    res.json(book);
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book_id = parseInt(req.params.id, 10);
    await prisma.book.delete({ where: { book_id } });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
