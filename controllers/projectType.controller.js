const ProjectType = require('../models/projectType.model');

const getAllProjectTypes = async (req, res) => {
    try {
        const types = await ProjectType.find();
        res.status(200).json({ status: 'success', data: types });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

module.exports = { getAllProjectTypes };
