const User = require('../models/user.model');
const Hero = require('../models/hero.model');
const Social = require('../models/social.model');
const Skill = require('../models/skill.model');
const Project = require('../models/project.model');
const Experience = require('../models/experience.model');
const Education = require('../models/education.model');

const getNaturalData = async (req, res) => {
    try {
        const user = await User.findOne({}, { __v: 0, refreshToken: 0, role: 0, email: 0, password: 0 });
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                data: {
                    message: "Data Not Found."
                }
            });
        }

        const userId = user._id;

        const [heroDoc, socialDoc, skillsDocs, projectsDocs, experiencesDocs, educationDocs] = await Promise.all([
            Hero.findOne({ userId }),
            Social.findOne({ userId }),
            Skill.find({ userId }).populate('typeId').sort({ order: 1 }),
            Project.find({ userId }).populate('typeId').sort({ createdAt: -1 }),
            Experience.find({ userId }).sort({ order: 1 }),
            Education.find({ userId }).sort({ order: 1 })
        ]);

        const hero = heroDoc ? {
            ...heroDoc.toObject(),
            title: heroDoc.titleEn || heroDoc.titleAr,
            subTitle: heroDoc.subTitleEn || heroDoc.subTitleAr,
            description: heroDoc.descriptionEn || heroDoc.descriptionAr,
        } : {};

        const social = socialDoc ? socialDoc.toObject() : {};

        const skills = skillsDocs.map(s => {
            const obj = s.toObject();
            return {
                ...obj,
                name: obj.nameEn || obj.nameAr,
                percent: obj.percent ? `${obj.percent}%` : '',
            };
        });

        const technicalSkills = skills.filter(s => s.typeId?.slug === 'tech');
        const nonTechnicalSkills = skills.filter(s => s.typeId?.slug === 'non-tech');

        const projects = projectsDocs.map(p => {
            const obj = p.toObject();
            return {
                ...obj,
                title: obj.titleEn || obj.titleAr,
                description: obj.descriptionEn || obj.descriptionAr,
                types: obj.typeId ? (obj.typeId.nameEn || obj.typeId.nameAr) : '',
            };
        });

        const experiences = experiencesDocs.map(e => {
            const obj = e.toObject();
            return {
                ...obj,
                position: obj.positionEn || obj.positionAr,
                duration: {
                    from: obj.durationFrom || '',
                    to: obj.durationTo || ''
                },
                responsibilities: (obj.responsibilitiesEn && obj.responsibilitiesEn.length > 0)
                    ? obj.responsibilitiesEn 
                    : (obj.responsibilitiesAr || []),
            };
        });

        const education = educationDocs.map(ed => {
            const obj = ed.toObject();
            return {
                ...obj,
                title: obj.titleEn || obj.titleAr,
                subtitle: obj.subTitleEn || obj.subTitleAr,
                subTitle: obj.subTitleEn || obj.subTitleAr,
                duration: {
                    from: obj.durationFrom || '',
                    to: obj.durationTo || ''
                },
                details: (obj.details || []).map(d => ({
                    ...d,
                    label: d.labelEn || d.labelAr,
                }))
            };
        });

        const fullData = {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            CVFile: user.CVFile,
            info: user.info,
            hero,
            herro: hero,
            social,
            skills,
            technicalSkills,
            nonTechnicalSkills,
            projects,
            experiences,
            education
        };

        res.status(200).json({
            status: "success",
            data: fullData
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "server error",
            error: error.message
        });
    }
};

const getCoreProfile = async (req, res) => {
    try {
        const user = await User.findOne({}, { __v: 0, refreshToken: 0, role: 0, email: 0, password: 0 });
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                data: { message: "Data Not Found." }
            });
        }

        const userId = user._id;

        const [heroDoc, socialDoc] = await Promise.all([
            Hero.findOne({ userId }),
            Social.findOne({ userId })
        ]);

        const hero = heroDoc ? {
            ...heroDoc.toObject(),
            title: heroDoc.titleEn || heroDoc.titleAr,
            subTitle: heroDoc.subTitleEn || heroDoc.subTitleAr,
            description: heroDoc.descriptionEn || heroDoc.descriptionAr,
        } : {};

        const social = socialDoc ? socialDoc.toObject() : {};

        const coreData = {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            CVFile: user.CVFile,
            info: user.info,
            hero,
            herro: hero, // Backward compatibility
            social
        };

        res.status(200).json({
            status: "success",
            data: coreData
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "server error",
            error: error.message
        });
    }
};

const fs = require('fs');
const path = require('path');

const syncPortfolioData = async (req, res) => {
    try {
        const user = await User.findOne({}, { __v: 0, refreshToken: 0, role: 0, email: 0, password: 0 });
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                data: {
                    message: "Data Not Found."
                }
            });
        }

        const userId = user._id;

        const [heroDoc, socialDoc, skillsDocs, projectsDocs, experiencesDocs, educationDocs] = await Promise.all([
            Hero.findOne({ userId }),
            Social.findOne({ userId }),
            Skill.find({ userId }).populate('typeId').sort({ order: 1 }),
            Project.find({ userId }).populate('typeId').sort({ createdAt: -1 }),
            Experience.find({ userId }).sort({ order: 1 }),
            Education.find({ userId }).sort({ order: 1 })
        ]);

        const hero = heroDoc ? {
            ...heroDoc.toObject(),
            title: heroDoc.titleEn || heroDoc.titleAr,
            subTitle: heroDoc.subTitleEn || heroDoc.subTitleAr,
            description: heroDoc.descriptionEn || heroDoc.descriptionAr,
        } : {};

        const social = socialDoc ? socialDoc.toObject() : {};

        const skills = skillsDocs.map(s => {
            const obj = s.toObject();
            return {
                ...obj,
                name: obj.nameEn || obj.nameAr,
                percent: obj.percent ? `${obj.percent}%` : '',
            };
        });

        const technicalSkills = skills.filter(s => s.typeId?.slug === 'tech');
        const nonTechnicalSkills = skills.filter(s => s.typeId?.slug === 'non-tech');

        const projects = projectsDocs.map(p => {
            const obj = p.toObject();
            return {
                ...obj,
                title: obj.titleEn || obj.titleAr,
                description: obj.descriptionEn || obj.descriptionAr,
                types: obj.typeId ? (obj.typeId.nameEn || obj.typeId.nameAr) : '',
            };
        });

        const experiences = experiencesDocs.map(e => {
            const obj = e.toObject();
            return {
                ...obj,
                position: obj.positionEn || obj.positionAr,
                duration: {
                    from: obj.durationFrom || '',
                    to: obj.durationTo || ''
                },
                responsibilities: (obj.responsibilitiesEn && obj.responsibilitiesEn.length > 0)
                    ? obj.responsibilitiesEn 
                    : (obj.responsibilitiesAr || []),
            };
        });

        const education = educationDocs.map(ed => {
            const obj = ed.toObject();
            return {
                ...obj,
                title: obj.titleEn || obj.titleAr,
                subtitle: obj.subTitleEn || obj.subTitleAr,
                subTitle: obj.subTitleEn || obj.subTitleAr,
                duration: {
                    from: obj.durationFrom || '',
                    to: obj.durationTo || ''
                },
                details: (obj.details || []).map(d => ({
                    ...d,
                    label: d.labelEn || d.labelAr,
                }))
            };
        });

        const fullData = {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            CVFile: user.CVFile,
            info: user.info,
            hero,
            herro: hero,
            social,
            skills,
            technicalSkills,
            nonTechnicalSkills,
            projects,
            experiences,
            education
        };

        const targetPath = path.join(__dirname, '../../myPortfolio-FrontEnd/public/data.json');
        
        fs.writeFileSync(targetPath, JSON.stringify({ status: "success", data: fullData }, null, 2));

        res.status(200).json({
            status: "success",
            message: "Portfolio data successfully synced to data.json!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "server error",
            error: error.message
        });
    }
};

module.exports = {
    getNaturalData,
    getCoreProfile,
    syncPortfolioData
};
