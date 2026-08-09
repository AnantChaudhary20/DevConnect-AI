import api from "./api";


export const getComments = async (
    projectId
) => {

    const response = await api.get(
        `/comments/${projectId}`
    );

    return response.data;

};


export const addComment = async (
    projectId,
    text
) => {

    const token =
        localStorage.getItem("token");

    const response = await api.post(
        `/comments/${projectId}`,
        {
            text
        },
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    return response.data;

};


export const deleteComment = async (
    commentId
) => {

    const token =
        localStorage.getItem("token");

    const response = await api.delete(
        `/comments/${commentId}`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    return response.data;

};