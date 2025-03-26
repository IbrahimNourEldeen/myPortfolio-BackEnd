const express=require('express');
const { getAllProjects, getProject, addProject, updateProject, deleteProject, deleteAllProjects}=require('../controllers/projects.controller')

const router= express.Router();


router.route('/')
    .get(getAllProjects)
    .post(addProject)
    .delete(deleteAllProjects)


router.route('/:projectId')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject)



module.exports=router;