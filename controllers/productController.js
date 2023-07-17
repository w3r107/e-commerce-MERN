import productModel from "../models/productModel.js";
import slugify from "slugify";
import braintree from "braintree";
import fs from "fs";
import { log } from "console";
import orderModel from "../models/orderModel.js";

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    console.log(req.fields);
    switch (true) {
      case name === "undefined":
        return res
          .status(500)
          .send({ success: "false", message: "Name is Required" });
      case description === "undefined":
        return res
          .status(500)
          .send({ success: "false", message: "Description is Required" });
      case price === "undefined":
        return res
          .status(500)
          .send({ success: "false", message: "Price is Required" });
      case category === "undefined":
        return res
          .status(500)
          .send({ success: "false", message: "Category is Required" });
      case quantity === "undefined":
        return res
          .status(500)
          .send({ success: "false", message: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          success: "false",
          message: "photo is Required and should be less then 1mb",
        });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    products.save();
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: "error in createProductController",
      error,
    });
    console.log(error);
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel.find({}).select("-photo");
    res.status(200).send({ success: "true", products });
    console.log(products);
  } catch (error) {
    res.status(500).send({
      success: "false",
      msg: "error in get product controller",
      error,
    });
    console.log(error);
  }
};

export const getPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pId).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: "false",
      msg: "error in get photo controller",
      error,
    });
    console.log(error);
  }
};

export const delProductController = async (req, res) => {
  try {
    const data = await productModel.findByIdAndDelete(req.params.pId);
    res.status(200).send({ success: "true" });
  } catch (error) {
    res.status(500).send({
      success: "false",
      msg: "error in del photo controller",
      error,
    });
    console.log(error);
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pId)
      .select("-photo")
      .populate("category");
    res.status(200).send({ success: true, product });
  } catch (error) {
    console.log(error);
  }
};

export const updateSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.pId,
      { ...req.fields, slug: slugify(req.fields.name) },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getSelectProductController = async (req, res) => {
  try {
    const { checked, selectedOption } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    console.log(selectedOption.split(",")[0], selectedOption.split(",")[1]);
    if (selectedOption)
      args.price = {
        $gte: parseInt(selectedOption.split(",")[0]),
        $lte: parseInt(selectedOption.split(",")[1]),
      };
    const products = await productModel.find(args);

    res.status(200).send({
      success: "true",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "error in getSelectPhotoController",
      error,
    });
    console.log(error);
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

//payment
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      // pass clientToken to your front-end
      if (err) {
        return res.status(500).send({
          success: "false",
          messsage: "error in braintreeTokenController",
        });
      } else {
        const clientToken = response.clientToken;
        return res.status(200).send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart } = req.body;
    const nonceFromTheClient = req.body.nonce;
    console.log(nonceFromTheClient);

    let total = 0;
    cart.map((val) => (total += parseInt(val.price)));
    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true,
        },
      },
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            success: "false",
            err,
          });
        } else {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.status(200).send({ success: "true" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
