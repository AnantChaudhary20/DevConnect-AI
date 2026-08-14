const User = require("../models/User");
const Project = require("../models/Project");

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const userService =
    require("../services/userService");


// ==========================================
// GET MY PROFILE
// ==========================================

const getProfile = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await userService.getProfile(
                req.user.userId
            );


        return res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        next(error);

    }

};


// ==========================================
// GET PUBLIC PROFILE
// ==========================================

const getPublicProfile = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.params.userId
            )
                .select(
                    "-password -emailVerificationCode -emailVerificationExpires"
                );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        const projects =
            await Project.find({

                owner:
                    req.params.userId

            })
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            user,

            projects

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (
    req,
    res,
    next
) => {

    try {

        const updatedUser =
            await userService.updateProfile(
                req.user.userId,
                req.body
            );


        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            user:
                updatedUser

        });

    }

    catch (error) {

        next(error);

    }

};


// ==========================================
// UPLOAD PROFILE PICTURE
// ==========================================

const uploadProfilePicture = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload an image"

            });

        }


        const user =
            await User.findById(
                req.user.userId
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const uploadFromBuffer =
            () => {

                return new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        const uploadStream =
                            cloudinary
                                .uploader
                                .upload_stream(

                                    {
                                        folder: "devconnect-profile",
                                        transformation: [
                                            {
                                                width: 600,
                                                height: 600,
                                                crop: "fill",
                                                gravity: "auto"
                                            }
                                        ]
                                    },

                                    (
                                        error,
                                        result
                                    ) => {

                                        if (
                                            error
                                        ) {

                                            reject(
                                                error
                                            );

                                        }

                                        else {

                                            resolve(
                                                result
                                            );

                                        }

                                    }

                                );


                        streamifier
                            .createReadStream(
                                req.file.buffer
                            )
                            .pipe(
                                uploadStream
                            );

                    }
                );

            };


        const result =
            await uploadFromBuffer();


        user.profilePicture =
            result.secure_url;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Profile picture uploaded successfully",

            profilePicture:
                result.secure_url

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// ==========================================
// TOGGLE BOOKMARK
// ==========================================

const toggleBookmark = async (
    req,
    res
) => {

    try {

        const project =
            await Project.findById(
                req.params.projectId
            );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found."

            });

        }


        const user =
            await User.findById(
                req.user.userId
            );


        const alreadyBookmarked =
            user.bookmarks.some(

                id =>
                    id.toString() ===
                    req.params.projectId

            );


        if (alreadyBookmarked) {

            user.bookmarks =
                user.bookmarks.filter(

                    id =>
                        id.toString() !==
                        req.params.projectId

                );


            await user.save();


            return res.status(200).json({

                success: true,

                message:
                    "Bookmark removed.",

                totalBookmarks:
                    user.bookmarks.length

            });

        }


        user.bookmarks.push(
            req.params.projectId
        );


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Project bookmarked.",

            totalBookmarks:
                user.bookmarks.length

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// ==========================================
// GET BOOKMARKS
// ==========================================

const getBookmarks = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.user.userId
            )
                .populate({

                    path:
                        "bookmarks",

                    populate: {

                        path:
                            "owner",

                        select:
                            "name profilePicture"

                    }

                });


        return res.status(200).json({

            success: true,

            totalBookmarks:
                user.bookmarks.length,

            bookmarks:
                user.bookmarks

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// ==========================================
// TOGGLE FOLLOW
// ==========================================

const toggleFollow = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await userService.toggleFollow(

                req.user.userId,

                req.params.userId

            );


        return res.status(200).json({

            success: true,

            ...result

        });

    }

    catch (error) {

        next(error);

    }

};


// ==========================================
// GET CONNECTIONS
// ==========================================

const getConnections = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.params.userId
            )

                .populate(
                    "followers",
                    "name profilePicture"
                )

                .populate(
                    "following",
                    "name profilePicture"
                );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        return res.status(200).json({

            success: true,

            followersCount:
                user.followers.length,

            followingCount:
                user.following.length,

            followers:
                user.followers,

            following:
                user.following

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


module.exports = {

    getProfile,

    getPublicProfile,

    updateProfile,

    uploadProfilePicture,

    toggleBookmark,

    getBookmarks,

    toggleFollow,

    getConnections

};