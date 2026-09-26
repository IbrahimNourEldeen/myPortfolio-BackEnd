const path = require('path');
const fs = require('fs/promises');
const Project = require('../models/project.model');
const ProjectType = require('../models/projectType.model');

const addProject = async (req, res) => {
    try {
        const { typeId, titleAr, titleEn, descriptionAr, descriptionEn, technologies, githubRepo, liveDemo, priority, isFeatured } = req.body;
        const userId = req.currentUser?.id;

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        if (!typeId) {
            return res.status(400).json({ status: 'fail', message: 'Project type is required' });
        }

        const type = await ProjectType.findById(typeId);
        if (!type) {
            return res.status(404).json({ status: 'fail', message: 'Invalid project type' });
        }

        let posterPaths = [];
        if (req.files && req.files.length > 0) {
            posterPaths = req.files.map(file => `/uploads/projects/${file.filename}`);
        }

        const newProject = new Project({
            userId,
            typeId,
            titleAr,
            titleEn,
            descriptionAr,
            descriptionEn,
            technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(tech => tech.trim()) : []),
            githubRepo,
            liveDemo,
            poster: posterPaths,
            priority: priority !== undefined ? Number(priority) : 0,
            isFeatured: isFeatured === true || isFeatured === 'true'
        });

        await newProject.save();

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

const getProjects = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.userId = userId;

        const projects = await Project.find(query).populate('typeId').sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: projects });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.currentUser.id;
        const { typeId, titleAr, titleEn, descriptionAr, descriptionEn, technologies, githubRepo, liveDemo, priority, isFeatured, existingImages } = req.body;

        const project = await Project.findOne({ _id: projectId, userId });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found' });
        }

        if (typeId) {
            const type = await ProjectType.findById(typeId);
            if (type) project.typeId = typeId;
        }
        if (titleAr !== undefined) project.titleAr = titleAr;
        if (titleEn !== undefined) project.titleEn = titleEn;
        if (descriptionAr !== undefined) project.descriptionAr = descriptionAr;
        if (descriptionEn !== undefined) project.descriptionEn = descriptionEn;
        if (githubRepo !== undefined) project.githubRepo = githubRepo;
        if (liveDemo !== undefined) project.liveDemo = liveDemo;
        if (priority !== undefined) project.priority = Number(priority);
        if (isFeatured !== undefined) project.isFeatured = isFeatured === true || isFeatured === 'true';

        if (technologies !== undefined) {
            project.technologies = Array.isArray(technologies) 
                ? technologies 
                : technologies.split(',').map(tech => tech.trim()).filter(Boolean);
        }

        let updatedPosters = project.poster || [];
        if (existingImages !== undefined) {
            try {
                const parsedExisting = JSON.parse(existingImages);
                
                // Identify removed images to delete from disk (optional but good practice)
                const removedImages = updatedPosters.filter(img => !parsedExisting.includes(img));
                const fs = require('fs').promises;
                const path = require('path');
                for (const removed of removedImages) {
                    const fullPath = path.join(__dirname, '..', removed);
                    await fs.unlink(fullPath).catch(() => {});
                }
                
                updatedPosters = parsedExisting;
            } catch (err) {
                console.error("Error parsing existingImages", err);
            }
        }

        if (req.files && req.files.length > 0) {
            const newPosters = req.files.map(file => `/uploads/projects/${file.filename}`);
            updatedPosters = [...updatedPosters, ...newPosters];
        }
        project.poster = updatedPosters;

        await project.save();

        return res.status(200).json({
            status: 'success',
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.currentUser.id;

        if (!projectId) {
            return res.status(400).json({ status: 'fail', message: 'Project ID is required' });
        }

        const project = await Project.findOne({ _id: projectId, userId });

        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found' });
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

        await Project.findByIdAndDelete(projectId);

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

const deleteProjectImage = async (req, res) => {
    try {
        const { projectId, imageIndex } = req.params;
        const userId = req.currentUser.id;

        const project = await Project.findOne({ _id: projectId, userId });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found' });
        }

        const idx = parseInt(imageIndex, 10);
        if (isNaN(idx) || idx < 0 || idx >= project.poster.length) {
            return res.status(400).json({ status: 'fail', message: 'Invalid image index' });
        }

        const imagePath = project.poster[idx];
        const fullPath = path.join(__dirname, '..', imagePath);
        try {
            await fs.unlink(fullPath);
        } catch (err) {
            console.error(`Failed to delete image file: ${imagePath}`, err.message);
        }

        project.poster.splice(idx, 1);
        await project.save();

        return res.status(200).json({
            status: 'success',
            message: 'Image deleted successfully',
            data: project
        });
    } catch (error) {
        console.error('Error deleting project image:', error.message);
        return res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
};

module.exports = {
    addProject,
    getProjects,
    updateProject,
    deleteProject,
    deleteProjectImage
};