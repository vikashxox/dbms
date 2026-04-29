const prisma = require("../prismaClient");
const { calculateFine } = require("../utils/fineCalculator");

const getBorrows = async (req, res, next) => {
  try {
    const borrows = await prisma.borrow.findMany({
      include: {
        member: true,
        book: true,
      },
    });
    res.json(borrows);
  } catch (error) {
    next(error);
  }
};

const getBorrowById = async (req, res, next) => {
  try {
    const borrow_id = parseInt(req.params.id, 10);
    const borrow = await prisma.borrow.findUnique({
      where: { borrow_id },
      include: { member: true, book: true },
    });
    if (!borrow) return res.status(404).json({ error: "Borrow record not found" });
    res.json(borrow);
  } catch (error) {
    next(error);
  }
};

const issueBook = async (req, res, next) => {
  try {
    const { member_id, book_id, issue_date, due_date } = req.body;

    const borrow = await prisma.borrow.create({
      data: {
        member: { connect: { member_id: parseInt(member_id, 10) } },
        book: { connect: { book_id: parseInt(book_id, 10) } },
        issue_date: issue_date ? new Date(issue_date) : new Date(),
        due_date: new Date(due_date),
        borrow_status: "issued",
      },
      include: { member: true, book: true },
    });
    res.status(201).json(borrow);
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const borrow_id = parseInt(req.params.id, 10);
    const { return_date } = req.body;
    const existingBorrow = await prisma.borrow.findUnique({ where: { borrow_id } });
    if (!existingBorrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    const returnedAt = return_date ? new Date(return_date) : new Date();
    const fine_amount = calculateFine(existingBorrow.due_date, returnedAt);

    const borrow = await prisma.borrow.update({
      where: { borrow_id },
      data: {
        return_date: returnedAt,
        fine_amount,
        borrow_status: "returned",
      },
      include: { member: true, book: true },
    });
    res.json(borrow);
  } catch (error) {
    next(error);
  }
};

const updateBorrow = async (req, res, next) => {
  try {
    const borrow_id = parseInt(req.params.id, 10);
    const data = { ...req.body };
    if (data.issue_date) data.issue_date = new Date(data.issue_date);
    if (data.due_date) data.due_date = new Date(data.due_date);
    if (data.return_date) data.return_date = new Date(data.return_date);

    const borrow = await prisma.borrow.update({ where: { borrow_id }, data });
    res.json(borrow);
  } catch (error) {
    next(error);
  }
};

const deleteBorrow = async (req, res, next) => {
  try {
    const borrow_id = parseInt(req.params.id, 10);
    await prisma.borrow.delete({ where: { borrow_id } });
    res.json({ message: "Borrow record deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBorrows, getBorrowById, issueBook, returnBook, updateBorrow, deleteBorrow };
