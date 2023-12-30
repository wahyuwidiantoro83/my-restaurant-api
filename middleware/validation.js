const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  try {
    if (req?.token) {
      const checkToken = jwt.verify(req.token, process.env.SCRT_KEY);
      if (checkToken) {
        req.userData = checkToken;
        next();
      } else {
        throw { rc: 400, success: false, message: "Token invalid" };
      }
    } else {
      throw { rc: 400, success: false, message: "Token invalid" };
    }
  } catch (error) {
    return res.status(error.rc || 500).send(error.message);
  }
};

const validateCashierRole = (req, res, next) => {};

module.exports = { validateToken };
