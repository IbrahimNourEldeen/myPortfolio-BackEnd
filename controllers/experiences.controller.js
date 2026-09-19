const Experience = require('../models/experience.model');

const addExperience = async (req, res) => {
    try {
        const { positionAr, positionEn, company, companyLogo, location, durationFrom, durationTo, responsibilitiesAr, responsibilitiesEn, order } = req.body;
        const userId = req.currentUser.id;

        const experience = new Experience({
            userId,
            positionAr,
            positionEn,
            company,
            companyLogo,
            location,
            durationFrom,
            durationTo,
            responsibilitiesAr,
            responsibilitiesEn,
            order
        });

        await experience.save();
        res.status(201).json({ status: 'success', message: 'Experience added successfully', data: experience });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const getExperiences = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.userId = userId;

        const experiences = await Experience.find(query).sort({ order: 1 });
        res.status(200).json({ status: 'success', data: experiences });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const updateExperience = async (req, res) => {
    try {
        const { expId } = req.params;
        const userId = req.currentUser.id;
        const { positionAr, positionEn, company, companyLogo, location, durationFrom, durationTo, responsibilitiesAr, responsibilitiesEn, order } = req.body;

        const experience = await Experience.findOne({ _id: expId, userId });
        if (!experience) {
            return res.status(404).json({ status: 'fail', message: 'Experience not found or unauthorized' });
        }

        if (positionAr !== undefined) experience.positionAr = positionAr;
        if (positionEn !== undefined) experience.positionEn = positionEn;
        if (company !== undefined) experience.company = company;
        if (companyLogo !== undefined) experience.companyLogo = companyLogo;
        if (location !== undefined) experience.location = location;
        if (durationFrom !== undefined) experience.durationFrom = durationFrom;
        if (durationTo !== undefined) experience.durationTo = durationTo;
        if (responsibilitiesAr !== undefined) experience.responsibilitiesAr = responsibilitiesAr;
        if (responsibilitiesEn !== undefined) experience.responsibilitiesEn = responsibilitiesEn;
        if (order !== undefined) experience.order = order;

        await experience.save();
        res.status(200).json({ status: 'success', message: 'Experience updated successfully', data: experience });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteExperience = async (req, res) => {
    try {
        const { expId } = req.params;
        const userId = req.currentUser.id;

        const experience = await Experience.findOne({ _id: expId, userId });
        if (!experience) {
            return res.status(404).json({ status: 'fail', message: 'Experience not found or unauthorized' });
        }

        await Experience.findByIdAndDelete(expId);
        res.status(200).json({ status: 'success', message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports = {
    addExperience,
    getExperiences,
    updateExperience,
    deleteExperience
};
