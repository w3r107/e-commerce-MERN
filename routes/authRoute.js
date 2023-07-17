import express from "express";
import { get } from "mongoose";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  getOrders,
  getAdminOrders,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

//routing

//REGISTER|| POST
router.post("/register", registerController);

//LOGIN|| POST
router.post("/login", loginController);

//FORGOT PASSOWORD ||POST
router.post("/forgot-password", forgotPasswordController);

//testing....
router.get("/test", requireSignIn, isAdmin, testController);

//Protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Protected route Admin auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/all-orders", requireSignIn, isAdmin, getAdminOrders);

router.get("/orders", requireSignIn, getOrders);

router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
