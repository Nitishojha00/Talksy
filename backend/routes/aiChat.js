const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiChat");
const wrapAsync = require("../middlewares/wrapAsync");
const { authorization } = require("../middlewares/authorization");

router.post(
    "/chat",
    authorization,
    wrapAsync(aiController.chat)
);

router.get(
    "/history",
    authorization,
    wrapAsync(aiController.getHistory)
);
module.exports = router;