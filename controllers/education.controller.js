const Education = require('../models/education.model');

const addEducation = async (req, res) => {
    try {
        const { titleAr, titleEn, subTitleAr, subTitleEn, durationFrom, durationTo, details, order } = req.body;
        const userId = req.currentUser.id;

        const education = new Education({
            userId,
            titleAr,
            titleEn,
            subTitleAr,
            subTitleEn,
            durationFrom,
            durationTo,
            details,
            order
        });

        await education.save();
        res.status(201).json({ status: 'success', message: 'Education added successfully', data: education });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const getEducation = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.userId = userId;

        const education = await Education.find(query).sort({ order: 1 });
        res.status(200).json({ status: 'success', data: education });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const updateEducation = async (req, res) => {
    try {
        const { eduId } = req.params;
        const userId = req.currentUser.id;
        const { titleAr, titleEn, subTitleAr, subTitleEn, durationFrom, durationTo, details, order } = req.body;

        const education = await Education.findOne({ _id: eduId, userId });
        if (!education) {
            return res.status(404).json({ status: 'fail', message: 'Education not found or unauthorized' });
        }

        if (titleAr !== undefined) education.titleAr = titleAr;
        if (titleEn !== undefined) education.titleEn = titleEn;
        if (subTitleAr !== undefined) education.subTitleAr = subTitleAr;
        if (subTitleEn !== undefined) education.subTitleEn = subTitleEn;
        if (durationFrom !== undefined) education.durationFrom = durationFrom;
        if (durationTo !== undefined) education.durationTo = durationTo;
        if (details !== undefined) education.details = details;
        if (order !== undefined) education.order = order;

        await education.save();
        res.status(200).json({ status: 'success', message: 'Education updated successfully', data: education });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteEducation = async (req, res) => {
    try {
        const { eduId } = req.params;
        const userId = req.currentUser.id;

        const education = await Education.findOne({ _id: eduId, userId });
        if (!education) {
            return res.status(404).json({ status: 'fail', message: 'Education not found or unauthorized' });
        }

        await Education.findByIdAndDelete(eduId);
        res.status(200).json({ status: 'success', message: 'Education deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports = {
    addEducation,
    getEducation,
    updateEducation,
    deleteEducation
};
