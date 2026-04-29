const bcrypt = require("bcrypt");
const prisma = require("../prismaClient");

const getMembers = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member_id = parseInt(req.params.id, 10);
    const member = await prisma.member.findUnique({ where: { member_id } });
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
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
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const member_id = parseInt(req.params.id, 10);
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const member = await prisma.member.update({ where: { member_id }, data });
    res.json(member);
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const member_id = parseInt(req.params.id, 10);
    const activeBorrow = await prisma.borrow.findFirst({
      where: { member_id, borrow_status: "issued" }
    });
    
    if (activeBorrow) {
      return res.status(400).json({ error: "Cannot delete a member with active unreturned books." });
    }

    await prisma.$transaction([
      prisma.borrow.deleteMany({ where: { member_id } }),
      prisma.member.delete({ where: { member_id } })
    ]);
    
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers, getMemberById, createMember, updateMember, deleteMember };
