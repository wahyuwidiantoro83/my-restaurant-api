const { Op } = require("sequelize");
const { products, productimages, categories } = require("../models");
const db = require("../models");
const { templateResponse } = require("../helpers/utils");
const getProduct = async (req, res, next) => {
  try {
    const filter = [];
    if (req.query?.category) {
      filter.push({ categoryId: req.query.category });
    }
    if (req.query?.search) {
      filter.push({ productName: { [Op.like]: `%${req.query.search}%` } });
    }

    const order = [];
    if (req.query?.sort) {
      if (req.query.sort.toLowerCase() === "price") {
        order.push(["price"]);
      }
      if (req.query.sort.toLowerCase() === "name") {
        order.push(["productName"]);
      }
    }

    console.log(filter);

    const result = await products.findAll({
      include: [
        {
          model: categories,
          required: true,
          attributes: ["category"],
        },
      ],
      attributes: {
        exclude: ["deletedAt"],
      },
      where: {
        [Op.and]: filter,
      },
      order: order,
    });
    return res.status(200).send({ success: true, message: "Data Products", result: result });
  } catch (error) {
    console.log(error);
    return res.status(error.rc || 500).send(error);
  }
};

const getProductManage = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const result = await products.findAll({
      include: [
        {
          model: categories,
          required: true,
          attributes: ["category"],
        },
      ],
      attributes: {
        exclude: ["deletedAt"],
      },
      where: {
        productName: {
          [Op.substring]: req.query.search || "",
        },
      },
      offset: 5 * (page - 1),
      limit: 5,
    });
    const totalData = await products.findAll({
      include: [
        {
          model: categories,
          required: true,
          attributes: ["category"],
        },
      ],
      attributes: {
        exclude: ["deletedAt"],
      },
      where: {
        productName: {
          [Op.substring]: req.query.search || "",
        },
      },
    });

    next(
      templateResponse(
        200,
        true,
        "Succes get all products",
        {
          row: totalData.length,
          data: result,
        },
        null
      )
    );
  } catch (error) {
    next(templateResponse(500, false, "Failed get all product", null, error.message));
  }
};

const createProduct = async (req, res, next) => {
  //for manage transaction
  const t = await db.sequelize.transaction();
  console.log(req.file);
  try {
    if (req.body?.productName && req.body?.price && req.body?.categoryId) {
      const result = await products.create(
        {
          productName: req.body.productName,
          price: req.body.price,
          categoryId: req.body.categoryId,
          image: req.file.filename,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ success: true, message: "Success add product data" });
    } else {
      throw {
        rc: 400,
        success: false,
        message: "Input data isnt complete",
      };
    }
  } catch (error) {
    await t.rollback();
    return res.status(error.rc || 500).send(error);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    if (req.params?.id) {
    }
  } catch (error) {
    return res.status(error.rc || 500).send(error);
  }
};
const deleteProduct = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    if (req.params?.id) {
      await products.destroy({
        where: {
          id: req.params.id,
        },
        transaction: t,
      });
      await t.commit();
      return res.status(201).send({ success: true, message: "Success delete product data" });
    } else {
      throw {
        rc: 400,
        success: false,
        message: "Data not found",
      };
    }
  } catch (error) {
    await t.rollback();
    return res.status(error.rc || 500).send(error);
  }
};

module.exports = {
  getProduct,
  getProductManage,
  createProduct,
  updateProduct,
  deleteProduct,
};
