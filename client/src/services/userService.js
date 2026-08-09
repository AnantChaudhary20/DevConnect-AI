import api from "./api";


// =====================================
// GET MY PROFILE
// =====================================

export const getProfile = async () => {

    const token =
        localStorage.getItem("token");


    const response =
        await api.get(
            "/users/profile",
            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }
            }
        );


    return response.data;

};


// =====================================
// GET PUBLIC PROFILE
// =====================================

export const getPublicProfile = async (
    userId
) => {

    const response =
        await api.get(
            `/users/profile/${userId}`
        );


    return response.data;

};


// =====================================
// UPDATE PROFILE
// =====================================

export const updateProfile = async (
    profileData
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await api.put(
            "/users/profile",
            profileData,
            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }
            }
        );


    return response.data;

};


// =====================================
// UPLOAD PROFILE PICTURE
// =====================================

export const uploadProfilePicture =
    async (
        imageFile
    ) => {

        const token =
            localStorage.getItem("token");


        const formData =
            new FormData();


        formData.append(
            "profilePicture",
            imageFile
        );


        const response =
            await api.post(

                "/users/upload-profile-picture",

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


// =====================================
// FOLLOW / UNFOLLOW
// =====================================

export const toggleFollow = async (
    userId
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await api.put(

            `/users/follow/${userId}`,

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


// =====================================
// GET CONNECTIONS
// =====================================

export const getConnections = async (
    userId
) => {

    const response =
        await api.get(
            `/users/connections/${userId}`
        );


    return response.data;

};


// =====================================
// BOOKMARK
// =====================================

export const toggleBookmark = async (
    projectId
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await api.put(

            `/users/bookmark/${projectId}`,

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


// =====================================
// GET BOOKMARKS
// =====================================

export const getBookmarks = async () => {

    const token =
        localStorage.getItem("token");


    const response =
        await api.get(

            "/users/bookmarks",

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }
            }

        );


    return response.data;

};