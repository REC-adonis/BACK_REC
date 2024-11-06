import express from "express";
import { addOrUpdateShippingInfo, removeShippingInfo } from "../controllers/shipping.info.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/shipping-address", verifyToken, addOrUpdateShippingInfo);
router.post("/shipping-address", verifyToken, removeShippingInfo);

export default router;