import ExpressFormidable from "express-formidable";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: "error in create-category-controller",
      error,
    });
    console.log(error);
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

export const delCategoryController = async (req, res) => {
  try {
    const { cId } = req.params;
    console.log(cId);
    const data = await categoryModel.findByIdAndDelete(cId);
    res.status(200).send({
      success: "true",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in delCategoryController",
      error,
    });
    console.log(error);
  }
};
