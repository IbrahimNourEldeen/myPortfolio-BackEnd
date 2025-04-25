const User = require('../models/user.model');

const addEducation = async (req, res) => {
    try {
        const education = req.body;
        if (!education) {
            return res.status(401).json({
                status: "fail",
                message: "write education"
            });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.education.push(education)
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'education added successfully',
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteEducation = async (req, res) => {
    try {
        const { eduIndex } = req.params;

        if (!eduIndex) {
            return res.status(404).json({ status: 'fail', message: 'please send true data' });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (eduIndex < 0 || eduIndex >= user.education.length) {
            return res.status(400).json({ status: 'fail', message: 'Invalid education index' });
        }

        user.education.splice(eduIndex, 1);

        await user.save();

        res.status(200).json({ status: 'success', message: 'education deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports={
    addEducation,
    deleteEducation
}
