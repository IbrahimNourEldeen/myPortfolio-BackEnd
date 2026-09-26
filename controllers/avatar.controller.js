const path = require('path');
const User = require('../models/user.model');
const fs = require('fs').promises;
const axios = require('axios');

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

        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const mimeType = req.file.mimetype;

        if (!allowedExtensions.includes(fileExt) || !mimeType.startsWith('image/')) {
            // Delete temp local file
            await fs.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ status: 'fail', message: 'Invalid file type. Only JPG, PNG, and JPEG are allowed.' });
        }

        // 1. Read file to base64
        const fileBuffer = await fs.readFile(req.file.path);
        const contentBase64 = fileBuffer.toString('base64');

        // 2. Upload to GitHub
        const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER     = process.env.GITHUB_REPO_OWNER;
        const GITHUB_REPO      = process.env.GITHUB_REPO_NAME;
        const GITHUB_BRANCH    = process.env.GITHUB_BRANCH || 'main';

        const timestamp = Date.now();
        const fileName = `avatar-${timestamp}${fileExt}`;
        const githubFilePath = `public/images/${fileName}`; // Where it lives in the frontend repo
        
        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubFilePath}`;
        
        const headers = {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };

        const putBody = {
            message: `chore: update profile avatar to ${fileName}`,
            content: contentBase64,
            branch: GITHUB_BRANCH,
        };

        await axios.put(apiUrl, putBody, { headers });

        // 3. Save relative path to MongoDB (e.g. "images/avatar-123.jpg")
        user.avatar = `images/${fileName}`;
        await user.save();

        // 4. Cleanup local temp file
        await fs.unlink(req.file.path).catch(err => console.error("Error deleting temp avatar file:", err));

        // If the user previously had a local avatar, we could try to delete it here, but skipping for simplicity
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Avatar updated and pushed to GitHub successfully', 
            data: { 
                avatar: user.avatar 
            }
        });

    } catch (error) {
        console.error("Avatar Upload Error:", error.response?.data || error.message);
        // Attempt to clean up temp file on error
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        res.status(500).json({ status: 'error', message: 'Server error during GitHub upload' });
    }
};

module.exports = updateImage;
