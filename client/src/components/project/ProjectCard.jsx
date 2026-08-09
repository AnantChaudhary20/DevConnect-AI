import {
    Link
} from "react-router-dom";

import LikeButton
    from "./LikeButton";

import BookmarkButton
    from "./BookmarkButton";


function ProjectCard({
    project
}) {

    return (

        <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            overflow-hidden
            hover:border-slate-700
            transition
        ">


            {/* PROJECT IMAGE */}

            <Link
                to={
                    `/project/${project._id}`
                }
            >

                <img
                    src={
                        project.images?.[0] ||
                        "https://via.placeholder.com/600x350?text=Project"
                    }
                    alt={
                        project.title
                    }
                    className="
                        w-full
                        h-52
                        object-cover
                    "
                />

            </Link>


            {/* CONTENT */}

            <div className="p-6">


                {/* TITLE */}

                <Link
                    to={
                        `/project/${project._id}`
                    }
                >

                    <h2 className="
                        text-2xl
                        font-bold
                        hover:text-blue-400
                        transition
                    ">

                        {
                            project.title
                        }

                    </h2>

                </Link>


                {/* OWNER */}

                {project.owner && (

                    <p className="
                        text-sm
                        text-slate-400
                        mt-2
                    ">

                        Created by{" "}

                        <Link
                            to={
                                `/user/${project.owner._id}`
                            }
                            className="
                                text-blue-400
                                hover:text-blue-300
                            "
                        >

                            {
                                project.owner.name
                            }

                        </Link>

                    </p>

                )}


                {/* DESCRIPTION */}

                <p className="
                    text-slate-400
                    mt-4
                    line-clamp-3
                    leading-6
                ">

                    {
                        project.description
                    }

                </p>


                {/* TECHNOLOGIES */}

                {project.tags &&
                    project.tags.length >
                    0 && (

                    <div className="
                        flex
                        flex-wrap
                        gap-2
                        mt-5
                    ">

                        {project.tags
                            .slice(0, 5)
                            .map(
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
                                            border-blue-500/20
                                            px-3
                                            py-1
                                            rounded-full
                                            text-xs
                                        "
                                    >

                                        {
                                            technology
                                        }

                                    </span>

                                )
                            )}

                    </div>

                )}


                {/* ACTIONS */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mt-6
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


                    <Link
                        to={
                            `/project/${project._id}`
                        }
                        className="
                            ml-auto
                            bg-blue-600
                            hover:bg-blue-700
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            font-semibold
                        "
                    >

                        View

                    </Link>

                </div>

            </div>

        </div>

    );

}


export default ProjectCard;