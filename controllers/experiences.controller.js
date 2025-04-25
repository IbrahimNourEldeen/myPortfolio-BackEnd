const User = require('../models/user.model');

const addExperience = async (req, res) => {
    try {
        const experience = req.body;
        if (!experience) {
            return res.status(401).json({
                status: "fail",
                message: "write experience"
            });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.experiences.push(experience)
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'experience added successfully',
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteExperience = async (req, res) => {
    try {
        const { expIndex } = req.params;

        if (!expIndex) {
            return res.status(404).json({ status: 'fail', message: 'please send true data' });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (expIndex < 0 || expIndex >= user.experiences.length) {
            return res.status(400).json({ status: 'fail', message: 'Invalid experience index' });
        }

        user.experiences.splice(expIndex, 1);

        await user.save();

        res.status(200).json({ status: 'success', message: 'experience deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports={
    addExperience,
    deleteExperience
}
