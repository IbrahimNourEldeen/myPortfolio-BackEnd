const SkillType = require('../models/skillType.model');

const getAllSkillTypes = async (req, res) => {
    try {
        const types = await SkillType.find();
        res.status(200).json({ status: 'success', data: types });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

module.exports = { getAllSkillTypes };
