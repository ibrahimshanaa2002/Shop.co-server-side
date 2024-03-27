const express = require("express");
const router = express.Router();
const Rating = require("../modules/Rating");
const nodemailer = require("nodemailer");

const {
  authUser,
  registerUser,
  SendMail,
  saveFeedback,
  resetPassword,
  createAdmin,
} = require("../controllers/userController");

router.post("/login", authUser);
router.post("/signup", registerUser);
router.post("/SendMail", SendMail);
router.post("/feedback", saveFeedback);
router.post("/createAdmin",createAdmin)
router.get("/feedback", async (req, res) => {
  try {
    let feedback;
    const { dateRange } = req.query;

    // Determine the date range based on the query parameter
    switch (dateRange) {
      case "today":
        feedback = await Rating.find({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });
        break;
      case "lastWeek":
        const lastWeekStartDate = new Date();
        lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
        feedback = await Rating.find({
          createdAt: { $gte: lastWeekStartDate },
        });
        break;
      case "lastMonth":
        const lastMonthStartDate = new Date();
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
        feedback = await Rating.find({
          createdAt: { $gte: lastMonthStartDate },
        });
        break;
      case "lastYear":
        const lastYearStartDate = new Date();
        lastYearStartDate.setFullYear(lastYearStartDate.getFullYear() - 1);
        feedback = await Rating.find({
          createdAt: { $gte: lastYearStartDate },
        });
        break;
      default:
        feedback = await Rating.find();
        break;
    }

    // Format the date in the desired format
    const formattedFeedback = feedback.map((item) => ({
      _id: item._id,
      name: item.name,
      title: item.title,
      body: item.body,
      rating: item.rating,
      date: item.createdAt.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }), // Format date in YYYY-MM-DD HH:mm A
    }));

    res.status(200).json(formattedFeedback); // Send the formatted feedback data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve feedback" });
  }
});
router.get("/feedback/count", async (req, res) => {
  try {
    // Retrieve the count of feedback documents from the database
    const count = await Rating.countDocuments();

    res.status(200).json({ count }); // Send the count of ratings as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve feedback count" });
  }
});
router.put("/resetPassword", resetPassword);
router.get("/resetPassword", (req, res) => {
  const resetToken = req.query.token;
  res.render("resetPasswordPage", { resetToken });
});
module.exports = router;
