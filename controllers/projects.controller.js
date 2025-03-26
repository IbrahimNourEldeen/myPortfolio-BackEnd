const Project = require('../models/project.model')

const getAllProjects = async (req, res) => {
    try {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;

        const skip = (page - 1) * limit;

        const projects = await Project.find({}, { __v: 0 }).limit(limit).skip(skip)

        res.status(200).json({
            status: 'success',
            data: {
                projects
            }
        })
    } catch (err) {
        return res.status(500).json({ status: 'error', message: "Server error" });
    }
}


const getProject = async (req, res) => {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId, { __v: false })
        if (!project) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    message: "project not found"
                }
            })
        }
        return res.status(200).json({
            status: 'success',
            data: {
                project
            }
        })

    } catch (err) {
        return res.status(500).json({ status: 'error', message: "error in Server" });
    }
}


const addProject = async (req, res) => {
    try {
        const newProject = new Project(req.body);

        await newProject.save();

        return res.status(201).json({
            status: 'success',
            data: {
                message: 'added successfully'
            }
        });

    } catch (err) {

        if (err.name === "ValidationError") {
            return res.status(400).json({
                status: "fail",
                data: {
                    message: "Invalid input data",
                    errors: err.errors
                }
            });
        }

        return res.status(500).json({ status: "error", message: "Server error" });
    }
};

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const updatedproject = await Project.findByIdAndUpdate(projectId, { $set: { ...req.body } });

        if (!updatedproject) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    message: "data not found"
                }
            })
        }

        res.status(200).json({
            status: 'sucess',
            data: {
                message: "updated successfully"
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Server error" });
    }
}

const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    await Project.findByIdAndDelete(projectId).then(() => {
        res.status(200).json({
            status: "success",
            data: {
                message: "Deleted Successfully"
            }
        })
    }).catch(() => {
        res.status(500).json({ status: "error", message: "Server error" });
    })
}

const deleteAllProjects = async (req, res) => {

    await Project.deleteMany({}).then(() => {
        res.status(200).json({
            status: "success",
            data: {
                message: "Deleted Successfully"
            }
        })
    }).catch(() => {
        res.status(500).json({ status: "error", message: "Server error" });
    })
}

module.exports = {
    getAllProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects
}