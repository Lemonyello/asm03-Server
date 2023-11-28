const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

exports.signupUser = async (req, res, next) => {
  try {
    const { email, password, phone, role, name } = req.body;
    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ msg: "This account already existed. Please try again." });

    const hashedPassword = await bcryptjs.hash(password, 12);

    const u = new User({ email, password: hashedPassword, phone, name, role });
    await u.save();
    res.status(200).json("Signup successfully.");
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim() });

    if (!user)
      return res
        .status(400)
        .json({ msg: "Cannot find this user. Please try another email." });

    if (user.role === "admin" || user.role === "operator") {
      if (user.password === password) {
        return req.session.save(() => res.status(200).json(user));
      } else
        return res
          .status(400)
          .json({ msg: "Password is not correct. Please try again." });
    }

    const doMatch = await bcryptjs.compare(password, user.password);

    if (doMatch) {
      req.session.save(() => res.status(200).json(user));
    } else
      res
        .status(400)
        .json({ msg: "Password is not correct. Please try again." });
  } catch (error) {
    next(error);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      $or: [
        {
          role: "admin",
        },
        {
          role: "operator",
        },
      ],
      $and: [
        {
          email: email.trim(),
          password,
        },
      ],
    });

    if (user) {
      req.session.save(() =>
        res.status(200).json({
          msg: "Login successfully.",
          role: user.role,
        })
      );
    } else
      res
        .status(400)
        .json({ msg: "Password or email is not correct. Please try again." });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = (req, res, next) => {
  req.session.destroy((err) =>
    res.status(200).json({ msg: "Logout successfully." })
  );
};

exports.getUserChatId = (req, res, next) => {
  res.status(200).json({ room: crypto.randomUUID() });
};
