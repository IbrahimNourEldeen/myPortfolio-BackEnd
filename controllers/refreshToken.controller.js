const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { generateAccessToken } = require('../utils/generateJwt');

module.exports = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_SEkRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: "error", message: "Invalid Refresh Token" });
            }

            const user = await User.findOne({ email: decoded.email });
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ status: "error", message: "Invalid Refresh Token" });
            }

            const newAccessToken = generateAccessToken({
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
            });

            res.status(200).json({ status: "success", data: { refreshToken, accessToken: newAccessToken } });
        });

    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
