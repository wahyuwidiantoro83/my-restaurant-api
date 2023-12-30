const { Op } = require("sequelize");
const { templateResponse } = require("../helpers/utils");
const { categories } = require("../models");
const fs = require("fs");

const createCategory = async (req, res, next) => {
  try {
    const result = await categories.create({
      category: req.body.categoryName,
      image: req.file.filename,
    });

    next(templateResponse(200, true, "success create category", result, null));
  } catch (error) {
    fs.unlinkSync(`./public/category/${req.file.filename}`);
    next(templateResponse(500, false, "Failed to create category", null, error.message));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    console.log(req.body, req.file);
    if (req.body?.categoryName && req.params?.id) {
      const oldData = await categories.findOne({
        where: {
          id: req.params.id,
        },
        raw: true,
      });

      if (req.file) {
        if (fs.existsSync(`./public/category/${oldData.image}`)) {
          fs.unlinkSync(`./public/category/${oldData.image}`);
        }
        const result = await categories.update(
          {
            category: req.body.categoryName,
            image: req.file.filename,
          },
          { where: { id: req.params.id } }
        );
        next(templateResponse(201, true, "Success edit data", result, null));
      } else {
        const result = await categories.update(
          {
            category: req.body.categoryName,
          },
          { where: { id: req.params.id } }
        );
        next(templateResponse(201, true, "Success edit data", result, null));
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(error.rc || 500).send(error);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const result = categories.destroy({ where: { id: req.params.id } });
    return res.status(201).send({ success: true, message: "Success delete data", result: result });
  } catch (error) {
    return res.status(error.rc || 500).send(error);
  }
};
const getCategory = async (req, res, next) => {
  const page = parseInt(req.query?.page) || 1;
  const search = req.query?.search || "";
  try {
    const result = await categories.findAll({
      where: {
        category: { [Op.substring]: search },
      },
      attributes: {
        exclude: ["deletedAt"],
      },
      offset: (page - 1) * 5,
      limit: 5,
    });
    const row = await categories.findAll({
      where: {
        category: { [Op.substring]: search },
      },
    });
    next(templateResponse(200, true, "Data category", { row: row.length, data: result }, null));
  } catch (error) {
    next(templateResponse(500, false, "Failed get data category", null, error.message));
  }
};

module.exports = { createCategory, updateCategory, deleteCategory, getCategory };
