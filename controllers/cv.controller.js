const path = require('path');
const User = require('../models/user.model');
const fs = require('fs').promises;

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

        const uploadDir = path.join(__dirname, '..', 'uploads/cv');
        await fs.mkdir(uploadDir, { recursive: true });

        const allowedExtensions = ['.pdf', '.doc', '.docx'];
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid file type. Allowed types are: .pdf, .doc, .docx' });
        }

        if (user.CVFile) {
            const oldFilePath = path.join(__dirname, '..', user.CVFile);
            try {
                await fs.unlink(oldFilePath);
            } catch (err) {
                console.error("Error deleting old file:", err);
            }
        }

        user.CVFile = `uploads/cv/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'CV updated successfully',
            data: { file: user.CVFile }
        });

    } catch (error) {
        console.error("Error updating CV:", error);
        res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
};

const downloadCV = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.CVFile) {
            return res.status(404).json({ status: 'fail', message: 'CV not found' });
        }

        const filePath = path.join(__dirname, '..', user.CVFile);

        try {
            await fs.access(filePath);
        } catch (err) {
            return res.status(404).json({ status: 'fail', message: 'CV file not found on server' });
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error("Error during file download:", err);
                return res.status(500).json({ status: 'error', message: 'Error downloading file' });
            }
        });

    } catch (error) {
        console.error("Error downloading CV:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
    }
};

module.exports = { updateFile, downloadCV };
