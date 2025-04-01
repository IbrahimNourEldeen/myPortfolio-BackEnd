const path = require('path');
const User = require('../models/user.model');
const fs = require('fs').promises;

const updateImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        }

        const userId = req.currentUser.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        const uploadDir = path.join(__dirname, '..', 'uploads/avatar');
        
        await fs.mkdir(uploadDir, { recursive: true });  

        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const mimeType = req.file.mimetype;

        if (!allowedExtensions.includes(fileExt) || !mimeType.startsWith('image/')) {
            return res.status(400).json({ status: 'fail', message: 'Invalid file type. Only JPG, PNG, and JPEG are allowed.' });
        }

        if (user.avatar) {
            const oldFilePath = path.join(__dirname, '..', user.avatar);
            fs.unlink(oldFilePath).catch(err => console.error("Error deleting old file:", err));
        }

        user.avatar = `/uploads/avatar/${req.file.filename}`;
        await user.save();

        res.status(200).json({ 
            status: 'success', 
            message: 'Avatar updated successfully', 
            data: { 
                avatar: user.avatar 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

module.exports = updateImage;
