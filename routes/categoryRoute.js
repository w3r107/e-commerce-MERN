import express from "express";
import {
  createCategoryController,
  getCategoryController,
  delCategoryController,
} from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

router.get("/get-category", getCategoryController);

router.delete(
  "/del-category/:cId",
  requireSignIn,
  isAdmin,
  delCategoryController
);

export default router;
