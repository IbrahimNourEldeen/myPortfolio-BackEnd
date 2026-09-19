const Skill = require('../models/skill.model');
const SkillType = require('../models/skillType.model');

const addSkill = async (req, res) => {
    try {
        const { typeId, nameAr, nameEn, percent, icon, color, order } = req.body;
        const userId = req.currentUser.id;

        if (!typeId || (!nameAr && !nameEn)) {
            return res.status(400).json({ status: "fail", message: "Missing required fields" });
        }

        const type = await SkillType.findById(typeId);
        if (!type) {
             return res.status(404).json({ status: "fail", message: "Invalid skill type" });
        }

        const skill = new Skill({
            userId,
            typeId,
            nameAr,
            nameEn,
            percent,
            icon,
            color,
            order
        });

        await skill.save();
        res.status(201).json({ status: 'success', message: 'Skill added successfully', data: skill });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const getSkills = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.userId = userId;

        const skills = await Skill.find(query).populate('typeId').sort({ order: 1 });
        res.status(200).json({ status: 'success', data: skills });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const updateSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.currentUser.id;
        const { typeId, nameAr, nameEn, percent, icon, color, order } = req.body;

        const skill = await Skill.findOne({ _id: skillId, userId });
        if (!skill) {
            return res.status(404).json({ status: 'fail', message: 'Skill not found or unauthorized' });
        }

        if (typeId) {
            const type = await SkillType.findById(typeId);
            if (type) skill.typeId = typeId;
        }
        if (nameAr !== undefined) skill.nameAr = nameAr;
        if (nameEn !== undefined) skill.nameEn = nameEn;
        if (percent !== undefined) skill.percent = percent;
        if (icon !== undefined) skill.icon = icon;
        if (color !== undefined) skill.color = color;
        if (order !== undefined) skill.order = order;

        await skill.save();
        res.status(200).json({ status: 'success', message: 'Skill updated successfully', data: skill });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const deleteSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.currentUser.id;

        const skill = await Skill.findOne({ _id: skillId, userId });
        if (!skill) {
            return res.status(404).json({ status: 'fail', message: 'Skill not found or unauthorized' });
        }

        await Skill.findByIdAndDelete(skillId);
        res.status(200).json({ status: 'success', message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports = {
    addSkill,
    getSkills,
    updateSkill,
    deleteSkill
};