const path = require('path');
const User = require('../models/user.model');
const fs = require('fs');

const updateFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (user.CVFile) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', user.CVFile);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        user.CVFile = req.file.filename;
        await user.save();

        res.status(200).json({ status: 'success', message: 'CV updated successfully', data: { file: user.CVFile } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const downloadCV = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.CVFile) {
            return res.status(404).json({ status: 'fail', message: 'CV not found' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', user.CVFile);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ status: 'fail', message: 'File not found on server' });
        }

        res.download(filePath, user.CVFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { updateFile, downloadCV };
