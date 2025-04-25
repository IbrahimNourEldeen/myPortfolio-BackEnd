const User = require('../models/user.model');

const addTechSkill = async (req, res) => {
    try {
        const skill = req.body;
        if (!skill) {
            return res.status(401).json({
                status: "fail",
                message: "write skill"
            });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.technicalSkills.push(skill)
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'skill added successfully',
            data: {
                skills: user.technicalSkills
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteSkill = async (req, res) => {
    try {
        const { skillIndex, type } = req.params;

        if (!skillIndex || !type) {
            return res.status(404).json({ status: 'fail', message: 'please send true data' });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (type === "tech") {
            if (skillIndex < 0 || skillIndex >= user.technicalSkills.length) {
                return res.status(400).json({ status: 'fail', message: 'Invalid skill index' });
            }

            user.technicalSkills.splice(skillIndex, 1);

            await user.save();

            res.status(200).json({ status: 'success', message: 'Skill deleted successfully' });

        } else if (type === "non-tech") {
            if (skillIndex < 0 || skillIndex >= user.nonTechnicalSkills.length) {
                return res.status(400).json({ status: 'fail', message: 'Invalid skill index' });
            }

            user.nonTechnicalSkills.splice(skillIndex, 1);

            await user.save();

            res.status(200).json({ status: 'success', message: 'Skill deleted successfully' });
        }else{
            return res.status(404).json({ status: 'fail', message: 'inputs error' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}



const addNonTechSkill = async (req, res) => {
    try {
        const skill = req.body;
        if (!skill) {
            return res.status(401).json({
                status: "fail",
                message: "write skill"
            });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.nonTechnicalSkills.push(skill)
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'skill added successfully',
            data: {
                skills: user.nonTechnicalSkills
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports = {
    addTechSkill,
    addNonTechSkill,
    deleteSkill
}