const { getUserIdFromToken } = require("../config/jwtProvider");
const User = require("../models/user");
const wrapAsync = require("./wrapAsync");

const authorization = wrapAsync(async (req, res, next) => {
	// console.log("AUTH HIT");
	// console.log(req.headers.authorization);
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(404).send({ message: "Token not found" });
	}
	const userId = getUserIdFromToken(token);
	// console.log("USER ID:", userId);
	if (userId) {
		req.user = await User.findById(userId).select("-password");
	}
	
	// console.log("REQ USER:", req.user);
	next();
});

module.exports = { authorization };
