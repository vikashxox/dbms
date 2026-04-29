const prisma = require("../prismaClient");

const getPublishers = async (req, res, next) => {
  try {
    const publishers = await prisma.publisher.findMany({ include: { books: true } });
    res.json(publishers);
  } catch (error) {
    next(error);
  }
};

const getPublisherById = async (req, res, next) => {
  try {
    const publisher_id = parseInt(req.params.id, 10);
    const publisher = await prisma.publisher.findUnique({
      where: { publisher_id },
      include: { books: true },
    });
    if (!publisher) return res.status(404).json({ error: "Publisher not found" });
    res.json(publisher);
  } catch (error) {
    next(error);
  }
};

const createPublisher = async (req, res, next) => {
  try {
    const { publisher_name, publisher_address, publisher_phone, publisher_email } = req.body;
    const publisher = await prisma.publisher.create({
      data: { publisher_name, publisher_address, publisher_phone, publisher_email },
    });
    res.status(201).json(publisher);
  } catch (error) {
    next(error);
  }
};

const updatePublisher = async (req, res, next) => {
  try {
    const publisher_id = parseInt(req.params.id, 10);
    const publisher = await prisma.publisher.update({ where: { publisher_id }, data: req.body });
    res.json(publisher);
  } catch (error) {
    next(error);
  }
};

const deletePublisher = async (req, res, next) => {
  try {
    const publisher_id = parseInt(req.params.id, 10);
    await prisma.publisher.delete({ where: { publisher_id } });
    res.json({ message: "Publisher deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublishers, getPublisherById, createPublisher, updatePublisher, deletePublisher };
