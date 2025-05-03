const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { generateAccessToken } = require('../utils/generateJwt');

module.exports = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                status: "fail",
                message: "Refresh token is required"
            });
        }

        jwt.verify(refreshToken, process.env.REFRESH_SEKRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: "fail",
                    message: "Invalid or expired refresh token"
                });
            }

            const user = await User.findOne({ email: decoded.email });
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({
                    status: "fail",
                    message: "Invalid refresh token"
                });
            }

            const newAccessToken = generateAccessToken({
                username: decoded.username,
                email: decoded.email,
                role: decoded.role,
                id: decoded.id
            });

            return res.status(200).json({
                status: "success",
                data: { accessToken: newAccessToken }
            });
        });

    } catch (error) {
        console.error("Error refreshing token:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};
