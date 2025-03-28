const User = require('../models/user.model')
const generateJwt = require('../utils/generateJwt')
const bcrypt = require('bcryptjs') 

const getAllUsers = async (req, res) => {
    try {
        const query = req.query;
        const limit = query.limit || 20;
        const page = query.page || 1;

        const skip = (page - 1) * limit;

        const users = await User.find({}, { __v: 0 }).limit(limit).skip(skip);
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        })

    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Server error" });
    }
}

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId, { __v: 0 })

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    user: "user not found"
                }
            })
        }
        return res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "error in Server" });
    }
}


const addUser = async (req, res) => {
    try {
        const newUser = new User(req.body);

        await newUser.save();

        return res.status(201).json({
            status: 'success',
            data: {
                message: 'added successfully'
            }
        });

    } catch (err) {

        if (err.name === "ValidationError") {
            return res.status(400).json({
                status: "fail",
                data: {
                    message: "Invalid input data",
                    errors: err.errors
                }
            });
        }

        return res.status(500).json({ status: "error", message: "Server error" });
    }
}

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
    const { userId } = req.params;
    await User.findByIdAndDelete(userId).then(() => {
        res.status(200).json({
            status: "success",
            data: {
                message: "Deleted Successfully"
            }
        })
    }).catch(() => {
        res.status(500).json({ status: "error", message: "Server error" });
    })
}

const deleteAllUsers = async (req, res) => {

    await User.deleteMany({}).then(() => {
        res.status(200).json({
            status: "success",
            data: {
                message: "Deleted Successfully"
            }
        })
    }).catch(() => {
        res.status(500).json({ status: "error", message: "Server error" });
    })
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ status: "fail", data: { message: "All fields are required" } });
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).json({ status: "fail", data: { message: 'user already exists' } })
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const token = generateJwt({ username: newUser.username, email: newUser.email });
        newUser.token = token;

        await newUser.save();

        res.status(201).json({ status: 'success', data: { token } })
        
    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }

}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({ status: 'fail', data: { message: 'email and password are required' } })
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ status: "fail", data: { message: 'this email is not registerd' } })
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if(!matchedPassword){
            return res.status(401).json({ status: "fail", data: { message: "Invalid email or password" } });
        }

        const token = generateJwt({ username: user.username, _id:user._id , email: user.email });
        return res.status(200).json({ status: 'success', data: { token } })


    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    register,
    login
}