module.exports = (req, res, next) => {
    if (req.currentUser.role != 'admin') {
        return res.status(401).json({ status: 'error', data: { message: 'this role not allowed' } })
    }
    next();
}
