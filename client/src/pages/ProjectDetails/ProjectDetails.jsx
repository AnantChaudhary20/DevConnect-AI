import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProjectById
} from "../../services/projectService";

import LikeButton
    from "../../components/project/LikeButton";

import BookmarkButton
    from "../../components/project/BookmarkButton";

import DeleteProjectButton
    from "../../components/project/DeleteProjectButton";


function ProjectDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [project, setProject] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadProject = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getProjectById(id);


                setProject(
                    response.project
                );

            }

            catch (error) {

                console.error(
                    "Project details error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Failed to load project."
                );

            }

            finally {

                setLoading(false);

            }

        };


        loadProject();

    }, [id]);


    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-slate-400
                    text-xl
                ">

                    Loading project...

                </p>

            </div>

        );

    }


    if (error || !project) {

        return (

            <div className="
                max-w-5xl
                mx-auto
                px-6
                py-10
            ">

                <div className="
                    bg-red-500/10
                    border
                    border-red-500/30
                    text-red-400
                    rounded-xl
                    p-6
                ">

                    {error ||
                        "Project not found."
                    }

                </div>

            </div>

        );

    }


    return (

        <div className="
            max-w-5xl
            mx-auto
            px-6
            py-10
        ">


            {/* BACK */}

            <button
                onClick={() =>
                    navigate(-1)
                }
                className="
                    text-slate-400
                    hover:text-white
                    mb-6
                "
            >

                ← Back

            </button>


            {/* PROJECT CARD */}

            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                overflow-hidden
            ">


                {/* IMAGE */}

                {project.images?.length > 0 && (

                    <img
                        src={
                            project.images[0]
                        }
                        alt={
                            project.title
                        }
                        className="
                            w-full
                            max-h-[500px]
                            object-cover
                        "
                    />

                )}


                <div className="p-8">


                    {/* TOP SECTION */}

                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-start
                        md:justify-between
                        gap-6
                    ">


                        <div>

                            <h1 className="
                                text-4xl
                                font-bold
                            ">

                                {
                                    project.title
                                }

                            </h1>


                            {project.owner && (

                                <p className="
                                    text-slate-400
                                    mt-3
                                ">

                                    Created by{" "}

                                    <span className="
                                        text-blue-400
                                    ">

                                        {
                                            project.owner.name
                                        }

                                    </span>

                                </p>

                            )}

                        </div>


                        {/* DELETE */}

                        <DeleteProjectButton
                            projectId={
                                project._id
                            }
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="
                        mt-8
                    ">

                        <h2 className="
                            text-2xl
                            font-bold
                            mb-4
                        ">

                            About This Project

                        </h2>


                        <p className="
                            text-slate-300
                            leading-8
                            whitespace-pre-line
                        ">

                            {
                                project.description
                            }

                        </p>

                    </div>


                    {/* TECHNOLOGIES */}

                    <div className="
                        mt-8
                    ">

                        <h2 className="
                            text-2xl
                            font-bold
                            mb-4
                        ">

                            Technologies

                        </h2>


                        {project.technologies?.length > 0 ? (

                            <div className="
                                flex
                                flex-wrap
                                gap-3
                            ">

                                {project.technologies.map(
                                    (
                                        technology,
                                        index
                                    ) => (

                                        <span
                                            key={
                                                index
                                            }
                                            className="
                                                bg-blue-600/20
                                                text-blue-300
                                                border
                                                border-blue-500/30
                                                px-4
                                                py-2
                                                rounded-full
                                            "
                                        >

                                            {
                                                technology
                                            }

                                        </span>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="
                                text-slate-500
                            ">

                                No technologies added.

                            </p>

                        )}

                    </div>


                    {/* CATEGORY + STATUS */}

                    <div className="
                        flex
                        flex-wrap
                        gap-3
                        mt-8
                    ">


                        {project.category && (

                            <span className="
                                bg-purple-600/20
                                text-purple-300
                                px-4
                                py-2
                                rounded-full
                            ">

                                {
                                    project.category
                                }

                            </span>

                        )}


                        {project.status && (

                            <span className="
                                bg-green-600/20
                                text-green-300
                                px-4
                                py-2
                                rounded-full
                            ">

                                {
                                    project.status
                                }

                            </span>

                        )}

                    </div>


                    {/* LINKS */}

                    <div className="
                        flex
                        flex-wrap
                        gap-4
                        mt-8
                    ">


                        {project.githubUrl && (

                            <a
                                href={
                                    project.githubUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    bg-slate-800
                                    hover:bg-slate-700
                                    px-6
                                    py-3
                                    rounded-lg
                                    font-semibold
                                "
                            >

                                GitHub

                            </a>

                        )}


                        {project.liveUrl && (

                            <a
                                href={
                                    project.liveUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    bg-blue-600
                                    hover:bg-blue-700
                                    px-6
                                    py-3
                                    rounded-lg
                                    font-semibold
                                "
                            >

                                Live Demo

                            </a>

                        )}

                    </div>


                    {/* ACTIONS */}

                    <div className="
                        flex
                        items-center
                        gap-4
                        mt-8
                        pt-6
                        border-t
                        border-slate-800
                    ">

                        <LikeButton
                            project={
                                project
                            }
                        />


                        <BookmarkButton
                            project={
                                project
                            }
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}


export default ProjectDetails;