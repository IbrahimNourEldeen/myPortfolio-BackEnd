const express=require('express');
const { getAllProjects, getProject, addProject, updateProject, deleteProject, deleteAllProjects}=require('../controllers/projects.controller')

const router= express.Router();

const verifyToken = require('../middleware/verifyToken')
const allowedToAdmin = require('../middleware/allowedToAdmin')

router.route('/')
    .get(getAllProjects)
    .post(verifyToken, allowedToAdmin, addProject)
    .delete(verifyToken, allowedToAdmin, deleteAllProjects)


router.route('/:projectId')
    .get(getProject)
    .put(verifyToken, allowedToAdmin, updateProject)
    .delete(verifyToken, allowedToAdmin, deleteProject)



module.exports=router;