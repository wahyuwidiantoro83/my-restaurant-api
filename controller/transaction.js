const getTransaction = () => {};
const { transactions, transactiondetails } = require("../models");
const createTransaction = async (req, res, next) => {
  try {
    if (req.body?.custEmail && req.body?.items) {
      console.log(req.body.custEmail);
      console.log(req.body.items);
      const total = req.body.items.reduce((curr, nxt) => curr + nxt.subtotal || 0, 0);
      const invCode = `INV-${new Date().getTime()}${Math.round(Math.random() * 10000)}`;
      console.log(invCode);
      console.log(total);
      const result = await transactions.create({
        inv: invCode,
        custEmail: req.body.custEmail,
        total: total,
      });
      const transactionDetails = req.body.items.map((value) => {
        return {
          transactionId: result.id,
          productId: value.productId,
          qty: value.qty,
          subtotal: value.subtotal,
        };
      });
      console.log(transactionDetails);
      const transactionAddResult = await transactiondetails.bulkCreate(transactionDetails);
      return res.status(200).send({
        success: true,
        message: "Transaction created",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTransaction, createTransaction };
