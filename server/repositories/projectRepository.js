const Project = require("../models/Project");

const createProject = async (projectData) => {
    return await Project.create(projectData);
};

const findById = async (id) => {
    return await Project.findById(id);
};

const updateProject = async (id, data) => {
    return await Project.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
};

const deleteProject = async (id) => {
    return await Project.findByIdAndDelete(id);
};

const getAllProjects = async (
    filter,
    sort,
    skip,
    limit
) => {

    return await Project.find(filter)
        .populate("owner", "name profilePicture")
        .sort(sort)
        .skip(skip)
        .limit(limit);

};

const saveProject = async (project) => {
    return await project.save();
};

module.exports = {
    createProject,
    findById,
    updateProject,
    deleteProject,
    getAllProjects,
    saveProject
};