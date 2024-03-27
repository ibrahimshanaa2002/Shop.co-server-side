const asyncHandler = require("express-async-handler");
const User = require("../modules/user");
const Rating = require("../modules/Rating");
const nodemailer = require("nodemailer");
const { generateToken } = require("../config/generateToken");
const { emailSubject, emailMessage } = require("./emailConfig");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: "Email is already in use" });
    return;
  }

  const user = await User.create({ username, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(500).json({ message: "User registration failed" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchedPassword(password))) {
    // Check if the user is an admin
    if (user.isAdmin) {
      // If admin, return admin response
      res.status(200).json({
        message: `Welcome Admin ${user.username}`,
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      // If not admin, return regular user response
      res.status(200).json({
        message: `Welcome ${user.username}`,
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});
const SendMail = async (req, res, next) => {
  try {
    const { Email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "shopcompass.sc@gmail.com",
        pass: "ebwb owna blze kwmb",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "shopcompass.sc@gmail.com",
      to: Email,
      subject: emailSubject,
      html: emailMessage,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

const saveFeedback = async (req, res) => {
  try {
    const { name, title, body, rating } = req.body;

    if (!body) {
      return res
        .status(400)
        .json({ message: "Review text (body) is required" });
    }

    // Create a new Feedback document with current timestamp
    const feedback = await Rating.create({
      name,
      title,
      body,
      rating,
      date: new Date(), // Include the current timestamp
    });

    res.status(201).json({ message: "Feedback saved successfully", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save feedback" });
  }
};

const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const resetToken = generateResetToken();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:4001/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail(email, resetLink);

    res.status(200).json({ message: "Reset password email sent successfully" });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ message: "Failed to send reset password email" });
  }
});

const generateResetToken = () => {
  const token = require("crypto").randomBytes(20).toString("hex");
  return token;
};

const sendResetPasswordEmail = async (email, resetLink) => {
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "shopcompass.sc@gmail.com",
      pass: "ebwb owna blze kwmb",
    },
  });

  // Email content
  const mailOptions = {
    from: "shopcompass.sc@gmail.com",
    to: email,
    subject: "Reset Your Password",
    html: `<p>Please click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};



const createAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email is already in use
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  // Create the admin user
  const admin = await User.create({ username, email, password, isAdmin: true });

  if (admin) {
    return res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      isAdmin: admin.isAdmin,
      token: generateToken(admin._id),
    });
  } else {
    return res.status(500).json({ message: "Failed to create admin user" });
  }
});
module.exports = {
  registerUser,
  authUser,
  SendMail,
  saveFeedback,
  resetPassword,
  createAdmin
};
