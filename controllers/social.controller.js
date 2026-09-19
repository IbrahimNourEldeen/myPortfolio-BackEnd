const Social = require('../models/social.model');

const addOrUpdateSocial = async (req, res) => {
    try {
        const { linkedin, github, twitter, facebook, website, phoneNumber, email } = req.body;
        const userId = req.currentUser?.id;

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        let social = await Social.findOne({ userId });
        if (!social) {
            social = new Social({ userId, linkedin, github, twitter, facebook, website, phoneNumber, email });
        } else {
            if (linkedin !== undefined) social.linkedin = linkedin;
            if (github !== undefined) social.github = github;
            if (twitter !== undefined) social.twitter = twitter;
            if (facebook !== undefined) social.facebook = facebook;
            if (website !== undefined) social.website = website;
            if (phoneNumber !== undefined) social.phoneNumber = phoneNumber;
            if (email !== undefined) social.email = email;
        }

        await social.save();
        res.status(200).json({ status: 'success', message: 'Social links updated successfully', data: social });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const getSocial = async (req, res) => {
    try {
        const { userId } = req.params;
        const social = await Social.findOne({ userId });
        if (!social) return res.status(404).json({ status: 'fail', message: 'Social not found' });
        res.status(200).json({ status: 'success', data: social });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}


module.exports = {
    addOrUpdateSocial,
    getSocial
};