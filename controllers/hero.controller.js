const Hero = require('../models/hero.model');

const addOrUpdateHero = async (req, res) => {
    try {
        const { titleAr, titleEn, subTitleAr, subTitleEn, descriptionAr, descriptionEn } = req.body;
        const userId = req.currentUser?.id;

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        let hero = await Hero.findOne({ userId });
        if (!hero) {
            hero = new Hero({ userId, titleAr, titleEn, subTitleAr, subTitleEn, descriptionAr, descriptionEn });
        } else {
            if (titleAr !== undefined) hero.titleAr = titleAr;
            if (titleEn !== undefined) hero.titleEn = titleEn;
            if (subTitleAr !== undefined) hero.subTitleAr = subTitleAr;
            if (subTitleEn !== undefined) hero.subTitleEn = subTitleEn;
            if (descriptionAr !== undefined) hero.descriptionAr = descriptionAr;
            if (descriptionEn !== undefined) hero.descriptionEn = descriptionEn;
        }

        await hero.save();
        res.status(200).json({ status: 'success', message: 'Hero updated successfully', data: hero });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

const getHero = async (req, res) => {
    try {
        const { userId } = req.params;
        const hero = await Hero.findOne({ userId });
        if (!hero) return res.status(404).json({ status: 'fail', message: 'Hero not found' });
        res.status(200).json({ status: 'success', data: hero });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports = {
    addOrUpdateHero,
    getHero
};
