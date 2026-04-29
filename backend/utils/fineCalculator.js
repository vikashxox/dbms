const calculateFine = (dueDate, returnDate) => {
  if (!returnDate || returnDate <= dueDate) {
    return 0;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const lateDays = Math.ceil((returnDate - dueDate) / msPerDay);
  const fineRate = 10;
  return lateDays * fineRate;
};

module.exports = { calculateFine };
