const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ status: "error", message: "token is required" })
    }
    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.SEKRET_KEY);
        req.currentUser = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ status: "error", message: "invalid token" })
    }
}
module.exports = verifyToken;