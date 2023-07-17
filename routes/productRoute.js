import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  getProductController,
  getPhotoController,
  delProductController,
  updateSingleProductController,
  getSingleProductController,
  getSelectProductController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
router.get("/get-product", formidable(), getProductController);

router.get("/get-product/:pId", formidable(), getSingleProductController);
router.put(
  "/update-product/:pId",
  requireSignIn,
  isAdmin,
  formidable(),
  updateSingleProductController
);
router.delete(
  "/del-product/:pId",
  requireSignIn,
  isAdmin,
  delProductController
);

router.post("/get-select-product", getSelectProductController);

router.get("/get-photo/:pId", getPhotoController);

//payment routes
router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
