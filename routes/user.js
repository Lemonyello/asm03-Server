const express = require("express");
const ctrlUser = require("../controllers/user");

const router = express.Router();

router.post("/user-login", ctrlUser.loginUser);

router.post("/admin-login", ctrlUser.loginAdmin);

router.post("/user-signup", ctrlUser.signupUser);

router.post("/user-logout", ctrlUser.logoutUser);

router.get("/user-chat-id", ctrlUser.getUserChatId);

module.exports = router;
