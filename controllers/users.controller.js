const User = require('../models/user.model')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateJwt')
const bcrypt = require('bcryptjs')

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 'fail',
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(userId, { __v: 0, refreshToken: 0 });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: "Server error",
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: { ...req.body } });

        if (!updatedUser) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    message: "data not found"
                }
            })
        }

        res.status(200).json({
            status: 'sucess',
            data: {
                message: "updated successfully"
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Server error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }
};
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "All fields are required"
            });
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({
                status: "fail",
                message: "User already exists"
            });
        }
        
        const userCount = await User.countDocuments();
        if (userCount >= 2) {
            return res.status(400).json({
                status: "fail",
                message: "Cannot add more than two accounts"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const accessToken = generateAccessToken({ 
            username: newUser.username, 
            email: newUser.email, 
            role: newUser.role, 
            id: newUser._id 
        });

        const refreshToken = generateRefreshToken({ 
            username: newUser.username, 
            email: newUser.email, 
            role: newUser.role, 
            id: newUser._id 
        });

        newUser.refreshToken = refreshToken;

        await newUser.save();

        return res.status(201).json({
            status: "success",
            data: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error("Register Error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: 'This email is not registered'
            });
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken({ 
            username: user.username, 
            email: user.email, 
            role: user.role, 
            id: user._id 
        });

        const refreshToken = generateRefreshToken({ 
            username: user.username, 
            email: user.email, 
            role: user.role, 
            id: user._id 
        });

        await User.findByIdAndUpdate(user._id, { refreshToken });

        return res.status(200).json({
            status: 'success',
            data: { accessToken, refreshToken }
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }
};

const logOut = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.currentUser.id, 
            { $set: { refreshToken: null } }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    message: "User not found"
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                message: "Logged Out Successfully"
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            data: {
                message: "Something went wrong",
                error: error.message
            }
        });
    }
};

module.exports = {
    getUser,
    updateUser,
    deleteUser,
    register,
    login,
    logOut
}