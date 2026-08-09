const projectRepository = require("../repositories/projectRepository");

const createProject = async (
    projectData,
    ownerId
) => {

    return await projectRepository.createProject({

        ...projectData,

        owner: ownerId

    });

};

module.exports = {
    createProject
};