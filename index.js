require("dotenv").config();
const PORT = process.env.PORT || 3333;
const express = require("express");
const app = express();
const cors = require("cors");
const bearer = require("express-bearer-token");
app.use(cors());
app.use(express.json());
app.use(bearer());

const { userRouter, categoryRouter, productRouter, transactionRouter } = require("./routes");
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/transaction", transactionRouter);

app.use("/public", express.static("public"));

app.use((error, req, res, next) => {
  return res.status(error.rc || 500).send(error);
});

app.listen(PORT, () => {
  console.log(`API berjalan di port ${PORT}`);
});
