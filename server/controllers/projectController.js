const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User");
const projectService = require("../services/projectService");


// ==========================================
// CREATE PROJECT
// ==========================================

const createProject = async (req, res, next) => {

    try {

        const project =
            await projectService.createProject(
                req.body,
                req.user.userId
            );

        return res.status(201).json({

            success: true,

            message:
                "Project created successfully.",

            project

        });

    }

    catch (error) {

        next(error);

    }

};


// ==========================================
// UPDATE PROJECT
// ==========================================

const updateProject = async (req, res) => {

    try {

        const project =
            await Project.findById(
                req.params.id
            );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"

            });

        }


        // Check project ownership

        if (
            project.owner.toString() !==
            req.user.userId
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to update this project"

            });

        }


        const {

            title,

            description,

            tags,

            githubUrl,

            liveUrl,

            category,

            status

        } = req.body;


        // Update fields

        project.title =
            title !== undefined
                ? title
                : project.title;


        project.description =
            description !== undefined
                ? description
                : project.description;


        project.tags =
            tags !== undefined
                ? tags
                : project.tags;


        project.githubUrl =
            githubUrl !== undefined
                ? githubUrl
                : project.githubUrl;


        project.liveUrl =
            liveUrl !== undefined
                ? liveUrl
                : project.liveUrl;


        project.category =
            category !== undefined
                ? category
                : project.category;


        project.status =
            status !== undefined
                ? status
                : project.status;


        await project.save();


        return res.status(200).json({

            success: true,

            message:
                "Project updated successfully",

            project

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
// DELETE PROJECT
// ==========================================

const deleteProject = async (req, res) => {

    try {

        const project =
            await Project.findById(
                req.params.id
            );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"

            });

        }


        if (
            project.owner.toString() !==
            req.user.userId
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to delete this project"

            });

        }


        await project.deleteOne();


        return res.status(200).json({

            success: true,

            message:
                "Project deleted successfully"

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
// GET ALL PROJECTS
// ==========================================

const getAllProjects = async (req, res) => {

    try {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;


        const {

            search,

            category,

            status,

            sort

        } = req.query;


        const filter = {};


        if (search) {

            filter.title = {

                $regex: search,

                $options: "i"

            };

        }


        if (category) {

            filter.category =
                category;

        }


        if (status) {

            filter.status =
                status;

        }


        let sortOption = {

            createdAt: -1

        };


        if (sort === "newest") {

            sortOption = {

                createdAt: -1

            };

        }


        if (sort === "oldest") {

            sortOption = {

                createdAt: 1

            };

        }


        if (sort === "title") {

            sortOption = {

                title: 1

            };

        }


        if (sort === "featured") {

            sortOption = {

                featured: -1,

                createdAt: -1

            };

        }


        const totalProjects =
            await Project.countDocuments(
                filter
            );


        const projects =
            await Project.find(filter)

                .populate(
                    "owner",
                    "name email profilePicture"
                )

                .sort(sortOption)

                .skip(skip)

                .limit(limit);


        return res.status(200).json({

            success: true,

            page,

            limit,

            totalProjects,

            totalPages:
                Math.ceil(
                    totalProjects / limit
                ),

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
// GET PROJECT BY ID
// ==========================================

const getProjectById = async (req, res) => {

    try {

        const project =
            await Project.findById(
                req.params.id
            )

                .populate(
                    "owner",
                    "name email profilePicture"
                );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"

            });

        }


        return res.status(200).json({

            success: true,

            project

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
// UPLOAD PROJECT IMAGE
// ==========================================

const uploadProjectImage = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload an image."

            });

        }


        const project =
            await Project.findById(
                req.params.id
            );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found."

            });

        }


        if (
            project.owner.toString() !==
            req.user.userId
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized."

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
                            cloudinary.uploader
                                .upload_stream(

                                    {
                                        folder:
                                            "devconnect-projects"
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


        project.images.push(
            result.secure_url
        );


        await project.save();


        return res.status(200).json({

            success: true,

            message:
                "Project image uploaded successfully.",

            image:
                result.secure_url,

            project

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
// LIKE / UNLIKE PROJECT
// ==========================================

const toggleLikeProject = async (
    req,
    res
) => {

    try {

        const project =
            await Project.findById(
                req.params.id
            );


        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found."

            });

        }


        const userId =
            req.user.userId;


        const alreadyLiked =
            project.likes.some(

                id =>
                    id.toString() ===
                    userId

            );


        if (alreadyLiked) {

            project.likes =
                project.likes.filter(

                    id =>
                        id.toString() !==
                        userId

                );


            await project.save();


            return res.status(200).json({

                success: true,

                liked: false,

                message:
                    "Project unliked.",

                totalLikes:
                    project.likes.length

            });

        }


        project.likes.push(
            userId
        );


        await project.save();


        return res.status(200).json({

            success: true,

            liked: true,

            message:
                "Project liked.",

            totalLikes:
                project.likes.length

        });

    }

    catch (error) {

        console.error(
            "Like error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// ==========================================
// GET FEED
// ==========================================

const getFeed = async (
    req,
    res
) => {

    try {

        const page =
            parseInt(
                req.query.page
            ) || 1;


        const limit =
            parseInt(
                req.query.limit
            ) || 10;


        const skip =
            (page - 1) * limit;


        const user =
            await User.findById(
                req.user.userId
            );


        const following =
            user.following;


        const projects =
            await Project.find({

                owner: {
                    $in: following
                }

            })

                .populate(
                    "owner",
                    "name profilePicture"
                )

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limit);


        return res.status(200).json({

            success: true,

            currentPage:
                page,

            totalProjects:
                projects.length,

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


module.exports = {

    createProject,

    getAllProjects,

    getProjectById,

    updateProject,

    deleteProject,

    uploadProjectImage,

    toggleLikeProject,

    getFeed

};