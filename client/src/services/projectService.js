import api from "./api";


// ==========================================
// GET ALL PROJECTS
// ==========================================

export const getAllProjects = async (params = {}) => {

    const response = await api.get(
        "/projects",
        {
            params
        }
    );

    return response.data;

};


// ==========================================
// GET PROJECT BY ID
// ==========================================

export const getProjectById = async (
    projectId
) => {

    const response = await api.get(
        `/projects/${projectId}`
    );

    return response.data;

};


// ==========================================
// CREATE PROJECT
// ==========================================

export const createProject = async (
    projectData
) => {

    const token =
        localStorage.getItem("token");


    const response = await api.post(
        "/projects",
        projectData,
        {
            headers: {

                Authorization:
                    `Bearer ${token}`

            }
        }
    );


    return response.data;

};


// ==========================================
// UPDATE PROJECT
// ==========================================

export const updateProject = async (
    projectId,
    projectData
) => {

    const token =
        localStorage.getItem("token");


    const response = await api.put(
        `/projects/${projectId}`,
        projectData,
        {
            headers: {

                Authorization:
                    `Bearer ${token}`

            }
        }
    );


    return response.data;

};


// ==========================================
// DELETE PROJECT
// ==========================================

export const deleteProject = async (
    projectId
) => {

    const token =
        localStorage.getItem("token");


    const response = await api.delete(
        `/projects/${projectId}`,
        {
            headers: {

                Authorization:
                    `Bearer ${token}`

            }
        }
    );


    return response.data;

};


// ==========================================
// LIKE / UNLIKE PROJECT
// ==========================================

export const toggleLikeProject =
    async (
        projectId
    ) => {

        const token =
            localStorage.getItem("token");


        const response =
            await api.put(

                `/projects/${projectId}/like`,

                {},

                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }
                }

            );


        return response.data;

    };


// ==========================================
// GET FEED
// ==========================================

export const getFeed = async (
    params = {}
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await api.get(

            "/projects/feed",

            {
                params,

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );


    return response.data;

};


// ==========================================
// UPLOAD PROJECT IMAGE
// ==========================================

export const uploadProjectImage =
    async (
        projectId,
        imageFile
    ) => {

        const token =
            localStorage.getItem("token");


        const formData =
            new FormData();


        formData.append(
            "projectImage",
            imageFile
        );


        const response =
            await api.post(

                `/projects/${projectId}/upload-image`,

                formData,

                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "multipart/form-data"

                    }

                }

            );


        return response.data;

    };