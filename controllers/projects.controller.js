const path = require('path');
const fs = require('fs/promises');
const User = require('../models/user.model');

const addProject = async (req, res) => {
    try {
        const { title, description, technologies, types, githubRepo, liveDemo } = req.body;

        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        const posterPaths = req.files.map(file => `/uploads/projects/${file.filename}`);

        const newProject = {
            title,
            description,
            technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(tech => tech.trim()),
            types,
            githubRepo,
            liveDemo,
            poster: posterPaths,
            createdAt: new Date()
        };

        user.projects.push(newProject);
        await user.save();

        return res.status(201).json({
            status: 'success',
            message: 'Project added successfully',
            data: newProject
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Project ID is required' 
            });
        }

        const user = await User.findById(req.currentUser.id);

        if (!user) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'User not found' 
            });
        }

        const project = user.projects.find(p => p._id.toString() === projectId);

        if (!project) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Project not found' 
            });
        }

        if (project.poster && project.poster.length > 0) {
            for (const posterPath of project.poster) {
                const fullPath = path.join(__dirname, '..', posterPath);
                try {
                    await fs.unlink(fullPath);
                } catch (err) {
                    console.error(`Failed to delete poster image: ${posterPath}`, err.message);
                }
            }
        }

        user.projects = user.projects.filter(p => p._id.toString() !== projectId);

        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error("Error deleting project:", error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
};


module.exports = {
    addProject,
    deleteProject
}