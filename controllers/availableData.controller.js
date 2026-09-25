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

const axios = require('axios');

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

        // ── GitHub API Sync ──────────────────────────────────────────────
        const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER     = process.env.GITHUB_REPO_OWNER;
        const GITHUB_REPO      = process.env.GITHUB_REPO_NAME;
        const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'public/data.json';
        const GITHUB_BRANCH    = process.env.GITHUB_BRANCH    || 'main';

        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;

        const headers = {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };

        // جلب الـ sha الحالي للملف (مطلوب من GitHub API للتحديث)
        let currentSha = null;
        try {
            const getResponse = await axios.get(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers });
            currentSha = getResponse.data.sha;
        } catch (getError) {
            // الملف غير موجود بعد - سيتم إنشاؤه لأول مرة
            if (getError.response?.status !== 404) {
                throw new Error(`GitHub GET error: ${getError.response?.data?.message || getError.message}`);
            }
        }

        // تحويل المحتوى إلى base64 (مطلوب من GitHub API)
        const fileContent = JSON.stringify({ status: "success", data: fullData }, null, 2);
        const contentBase64 = Buffer.from(fileContent).toString('base64');

        const syncDate = new Date().toISOString();
        const putBody = {
            message: `chore: sync portfolio data [${syncDate}]`,
            content: contentBase64,
            branch: GITHUB_BRANCH,
            ...(currentSha && { sha: currentSha }),
        };

        await axios.put(apiUrl, putBody, { headers });
        // ────────────────────────────────────────────────────────────────

        res.status(200).json({
            status: "success",
            message: "Portfolio data synced to GitHub successfully! Vercel will rebuild shortly."
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
