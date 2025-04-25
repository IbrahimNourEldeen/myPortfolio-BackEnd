const User = require('../models/user.model');

const addHerro = async (req, res) => {
    try {
        const { name, text } = req.body;

        if (!name || !text) {
            return res.status(400).json({ status: 'fail', message: 'please send true data' });
        }

        const allowedKeys = ['title', 'subTitle', 'description'];
        if (!allowedKeys.includes(name)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid herro field' });
        }

        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (!user.herro) {
            user.herro = {};
        }

        user.set(`herro.${name}`, text);
        await user.save();

        res.status(200).json({ status: 'success', message: 'added successfully' });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteHerro = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ status: 'fail', message: 'please send true data' });
        }

        const allowedKeys = ['title', 'subTitle', 'description'];
        if (!allowedKeys.includes(name)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid herro field' });
        }

        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.set(`herro.${name}`, undefined);
        await user.save();

        res.status(200).json({ status: 'success', message: 'deleted successfully' });

    } catch (error) {
        console.error("Error in addURL:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}; 

module.exports = {
    addHerro,
    deleteHerro
}