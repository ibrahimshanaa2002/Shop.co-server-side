const express = require("express");
const { protect } = require("../middlewares/authMiddleWare");
const { createOrder, getAllOrders } = require("../controllers/checkOutController");
const router = express.Router();

router.post("/create-order",createOrder);
router.get("/get-orders",getAllOrders);



module.exports = router;