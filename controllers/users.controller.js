const User = require('../models/user.model')

const getAllUsers = async (req, res) => {
    try {
        const users =await User.find({}, { __v: 0 });
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

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    deleteAllUsers
}