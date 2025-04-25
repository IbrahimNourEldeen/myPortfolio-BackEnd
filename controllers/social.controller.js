
const User = require("../models/user.model")

const addURL = async (req, res) => {
    try {
        const { name, url } = req.body;

        if (!name || !url) {
            return res.status(400).json({ status: 'fail', message: 'please send true data' });
        }

        const allowedKeys = ['linkedin', 'github', 'twitter', 'facebook', 'website', 'phoneNumber', 'email'];
        if (!allowedKeys.includes(name)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid social media field' });
        }

        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (!user.social) {
            user.social = {};
        }

        user.set(`social.${name}`, url);
        await user.save();

        res.status(200).json({ status: 'success', message: 'added successfully' });

    } catch (error) {
        console.error("Error in addURL:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const deleteURL = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ status: 'fail', message: 'please send true data' });
        }

        const allowedKeys = ['linkedin', 'github', 'twitter', 'facebook', 'website', 'phoneNumber', 'email'];
        if (!allowedKeys.includes(name)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid social media field' });
        }

        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.set(`social.${name}`, undefined);
        await user.save();

        res.status(200).json({ status: 'success', message: 'deleted successfully' });

    } catch (error) {
        console.error("Error in addURL:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}; 


module.exports = {
    addURL,
    deleteURL
}