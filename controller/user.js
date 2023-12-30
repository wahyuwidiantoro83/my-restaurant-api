const bcrypt = require("bcrypt");
const { users } = require("../models");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const result = await users.create(req.body);
    return res.status(200).send({
      success: true,
      message: "Register is success",
      result: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  try {
    if (req.body?.username) {
      const checkUser = await users.findOne({
        where: {
          username: req.body.username,
        },
        raw: true,
      });
      if (checkUser) {
        const checkPassword = await bcrypt.compare(req.body?.password, checkUser.password);
        if (checkPassword) {
          const { id, username, role } = checkUser;
          const token = jwt.sign({ id, username, role }, process.env.SCRT_KEY, { expiresIn: "7d" });
          return res.status(201).send({
            success: true,
            message: "Login success",
            result: {
              username,
              role,
              token,
            },
          });
        }
        throw {
          rc: 400,
          success: false,
          message: "Username and password not match",
        };
      }
      throw {
        rc: 400,
        success: false,
        message: "Username not found",
      };
    }
    throw {
      rc: 400,
      success: false,
      message: "Invalid username",
    };
  } catch (error) {
    console.log(error);
    return res.status(error.rc || 500).send(error);
  }
};

const keepLogin = async (req, res, next) => {
  const checkUser = await users.findOne({
    where: {
      id: req.userData.id,
      username: req.userData.username,
    },
    raw: true,
  });

  const { id, username, role } = checkUser;
  const token = jwt.sign({ id, username, role }, process.env.SCRT_KEY, { expiresIn: "7d" });
  return res.status(201).send({
    success: true,
    message: "Login success",
    result: {
      username,
      role,
      token,
    },
  });
};

module.exports = { register, login, keepLogin };
