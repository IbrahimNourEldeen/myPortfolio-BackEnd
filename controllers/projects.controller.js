const Project = require('../models/user.model')

const getAllProjects = async (req, res) => {
    try {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;

        const skip = (page - 1) * limit;

        const projects = await Project.find({}, { __v: 0 }).limit(limit).skip(skip);

        if (projects.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No projects found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                projects
            }
        });
    } catch (err) {
        console.error("Error fetching projects:", err.message);
        return res.status(500).json({
            status: 'error',
            message: "Server error",
            error: err.message
        });
    }
}

const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId, { __v: false });

        if (!project) {
            return res.status(404).json({
                status: 'fail',
                message: 'Project not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (err) {
        console.error("Error fetching project:", err.message);
        return res.status(500).json({
            status: 'error',
            message: 'Error in server',
            error: err.message
        });
    }
}
const addProject = async (req, res) => {
    try {
        const newProject = new Project(req.body);

        await newProject.save();

        return res.status(201).json({
            status: 'success',
            data: {
                message: 'Project added successfully'
            }
        });

    } catch (err) {

        if (err.name === "ValidationError") {
            return res.status(400).json({
                status: "fail",
                message: "Invalid input data",
                errors: err.errors
            });
        }

        console.error("Error adding project:", err.message);
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const updatedProject = await Project.findByIdAndUpdate(projectId, { $set: { ...req.body } }, { new: true });

        if (!updatedProject) {
            return res.status(404).json({
                status: 'fail',
                message: "Project not found"
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                message: "Project updated successfully"
            }
        });

    } catch (error) {
        console.error("Error updating project:", error.message);
        return res.status(500).json({
            status: 'error',
            message: "Server error",
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(404).json({
                status: "fail",
                message: "Project not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting project:", error.message);
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }
};

const deleteAllProjects = async (req, res) => {
    try {
        const result = await Project.deleteMany({});
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No projects to delete"
            });
        }

        res.status(200).json({
            status: "success",
            message: "All projects deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting all projects:", error.message);
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getAllProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects
}