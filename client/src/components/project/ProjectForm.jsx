import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    createProject,
    uploadProjectImage
} from "../../services/projectService";


function ProjectForm() {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({

            title: "",
            description: "",
            tags: "",
            githubUrl: "",
            liveUrl: "",
            category: "Web Development",
            status: "Planning"

        });


    const [selectedImage, setSelectedImage] =
        useState(null);


    const [imagePreview, setImagePreview] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            (previousData) => ({

                ...previousData,

                [name]: value

            })
        );

    };


    const handleImageChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            setError(
                "Please select an image file."
            );

            return;

        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            setError(
                "Image must be smaller than 5MB."
            );

            return;

        }


        setError("");

        setSelectedImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );

    };


    const validateForm = () => {

        if (
            formData.title.trim().length <
            3
        ) {

            return "Project title must be at least 3 characters.";

        }


        if (
            formData.description.trim().length <
            10
        ) {

            return "Project description must be at least 10 characters.";

        }


        if (
            formData.githubUrl &&
            !formData.githubUrl.startsWith(
                "http"
            )
        ) {

            return "Please enter a valid GitHub URL.";

        }


        if (
            formData.liveUrl &&
            !formData.liveUrl.startsWith(
                "http"
            )
        ) {

            return "Please enter a valid Live Demo URL.";

        }


        return "";

    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        try {

            setLoading(true);


            const projectData = {

                title:
                    formData.title.trim(),

                description:
                    formData.description.trim(),

                tags:
                    formData.tags
                        .split(",")
                        .map(
                            (tag) =>
                                tag.trim()
                        )
                        .filter(
                            (tag) =>
                                tag.length > 0
                        ),

                githubUrl:
                    formData.githubUrl.trim(),

                liveUrl:
                    formData.liveUrl.trim(),

                category:
                    formData.category,

                status:
                    formData.status

            };


            const response =
                await createProject(
                    projectData
                );


            console.log(
                "Project created:",
                response
            );


            const project =
                response.project;


            if (
                selectedImage &&
                project?._id
            ) {

                await uploadProjectImage(
                    project._id,
                    selectedImage
                );

            }


            navigate(
                `/project/${project._id}`
            );

        } catch (error) {

            console.error(
                "Create project error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to create project."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="
            max-w-3xl
            mx-auto
            px-6
            py-10
        ">


            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-8
            ">


                <h1 className="
                    text-4xl
                    font-bold
                    mb-3
                ">

                    Create Project

                </h1>


                <p className="
                    text-slate-400
                    mb-8
                ">

                    Showcase something you built
                    to the developer community.

                </p>


                {error && (

                    <div className="
                        bg-red-500/10
                        border
                        border-red-500/30
                        text-red-400
                        rounded-lg
                        p-4
                        mb-6
                    ">

                        {error}

                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-6
                    "
                >


                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Project Title

                        </label>


                        <input
                            type="text"
                            name="title"
                            value={
                                formData.title
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                e.g. DevConnect AI
                            "
                            className="
                                w-full
                                bg-slate-800
                                border
                                border-slate-700
                                rounded-lg
                                px-4
                                py-3
                                text-white
                                outline-none
                            "
                            required
                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Description

                        </label>


                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                Explain what your
                                project does...
                            "
                            rows="7"
                            className="
                                w-full
                                bg-slate-800
                                border
                                border-slate-700
                                rounded-lg
                                px-4
                                py-3
                                text-white
                                outline-none
                                resize-none
                            "
                            required
                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Technologies

                        </label>


                        <input
                            type="text"
                            name="tags"
                            value={
                                formData.tags
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                React, Node.js,
                                MongoDB, Express
                            "
                            className="
                                w-full
                                bg-slate-800
                                border
                                border-slate-700
                                rounded-lg
                                px-4
                                py-3
                                text-white
                                outline-none
                            "
                        />


                        <p className="
                            text-sm
                            text-slate-500
                            mt-2
                        ">

                            Separate technologies
                            with commas.

                        </p>

                    </div>


                    <div className="
                        grid
                        md:grid-cols-2
                        gap-5
                    ">


                        <div>

                            <label className="
                                block
                                mb-2
                                font-semibold
                            ">

                                Category

                            </label>


                            <select
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                className="
                                    w-full
                                    bg-slate-800
                                    border
                                    border-slate-700
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                "
                            >

                                <option>
                                    Web Development
                                </option>

                                <option>
                                    Mobile Development
                                </option>

                                <option>
                                    AI / Machine Learning
                                </option>

                                <option>
                                    Data Science
                                </option>

                                <option>
                                    DevOps
                                </option>

                                <option>
                                    Cybersecurity
                                </option>

                                <option>
                                    Other
                                </option>

                            </select>

                        </div>


                        <div>

                            <label className="
                                block
                                mb-2
                                font-semibold
                            ">

                                Status

                            </label>


                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                className="
                                    w-full
                                    bg-slate-800
                                    border
                                    border-slate-700
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                "
                            >

                                <option>
                                    Planning
                                </option>

                                <option>
                                    In Progress
                                </option>

                                <option>
                                    Completed
                                </option>

                            </select>

                        </div>

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            GitHub URL

                        </label>


                        <input
                            type="url"
                            name="githubUrl"
                            value={
                                formData.githubUrl
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                https://github.com/username/project
                            "
                            className="
                                w-full
                                bg-slate-800
                                border
                                border-slate-700
                                rounded-lg
                                px-4
                                py-3
                                text-white
                                outline-none
                            "
                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Live Demo URL

                        </label>


                        <input
                            type="url"
                            name="liveUrl"
                            value={
                                formData.liveUrl
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                https://myproject.com
                            "
                            className="
                                w-full
                                bg-slate-800
                                border
                                border-slate-700
                                rounded-lg
                                px-4
                                py-3
                                text-white
                                outline-none
                            "
                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Project Image

                        </label>


                        <input
                            type="file"
                            accept="
                                image/png,
                                image/jpeg,
                                image/webp
                            "
                            onChange={
                                handleImageChange
                            }
                            className="
                                w-full
                                text-slate-300
                            "
                        />


                        <p className="
                            text-sm
                            text-slate-500
                            mt-2
                        ">

                            Maximum size: 5MB.

                        </p>

                    </div>


                    {imagePreview && (

                        <div>

                            <p className="
                                text-sm
                                text-slate-400
                                mb-3
                            ">

                                Image Preview

                            </p>


                            <img
                                src={
                                    imagePreview
                                }
                                alt="
                                    Project Preview
                                "
                                className="
                                    w-full
                                    h-64
                                    object-cover
                                    rounded-xl
                                    border
                                    border-slate-700
                                "
                            />

                        </div>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-600
                            hover:bg-blue-700
                            py-4
                            rounded-lg
                            font-semibold
                            text-lg
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        {loading
                            ? "Creating Project..."
                            : "Create Project"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}


export default ProjectForm;