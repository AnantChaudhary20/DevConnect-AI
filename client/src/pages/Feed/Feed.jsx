import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getAllProjects
} from "../../services/projectService";

import ProjectCard
    from "../../components/project/ProjectCard";


function Feed() {

    const [projects, setProjects] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [sort, setSort] =
        useState("newest");

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);


    const fetchProjects = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getAllProjects({

                    page,

                    limit: 6,

                    search,

                    category,

                    status,

                    sort

                });


            setProjects(
                response.projects || []
            );


            setTotalPages(
                response.totalPages || 1
            );

        }

        catch (error) {

            console.error(
                "Feed error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to load projects."
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProjects();

    }, [
        page,
        category,
        status,
        sort
    ]);


    const handleSearch = (
        event
    ) => {

        event.preventDefault();

        setPage(1);

        fetchProjects();

    };


    const clearFilters = () => {

        setSearch("");

        setCategory("");

        setStatus("");

        setSort("newest");

        setPage(1);

    };


    return (

        <div className="
            max-w-7xl
            mx-auto
            px-6
            py-10
        ">


            {/* HEADER */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-5
                mb-8
            ">


                <div>

                    <h1 className="
                        text-4xl
                        font-bold
                    ">

                        Developer Feed

                    </h1>


                    <p className="
                        text-slate-400
                        mt-2
                    ">

                        Discover projects built
                        by developers.

                    </p>

                </div>


                <Link
                    to="/create-project"
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        px-6
                        py-3
                        rounded-lg
                        font-semibold
                        text-center
                    "
                >

                    + Create Project

                </Link>

            </div>


            {/* SEARCH */}

            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                mb-8
            ">


                <form
                    onSubmit={
                        handleSearch
                    }
                    className="
                        flex
                        flex-col
                        md:flex-row
                        gap-4
                    "
                >


                    <input
                        type="text"
                        value={search}
                        onChange={
                            (event) =>
                                setSearch(
                                    event.target.value
                                )
                        }
                        placeholder="
                            Search projects...
                        "
                        className="
                            flex-1
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


                    <button
                        type="submit"
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            px-7
                            py-3
                            rounded-lg
                            font-semibold
                        "
                    >

                        Search

                    </button>

                </form>


                {/* FILTERS */}

                <div className="
                    grid
                    md:grid-cols-3
                    gap-4
                    mt-5
                ">


                    <select
                        value={category}
                        onChange={
                            (event) => {

                                setCategory(
                                    event.target.value
                                );

                                setPage(1);

                            }
                        }
                        className="
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

                        <option value="">
                            All Categories
                        </option>

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


                    <select
                        value={status}
                        onChange={
                            (event) => {

                                setStatus(
                                    event.target.value
                                );

                                setPage(1);

                            }
                        }
                        className="
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

                        <option value="">
                            All Statuses
                        </option>

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


                    <select
                        value={sort}
                        onChange={
                            (event) => {

                                setSort(
                                    event.target.value
                                );

                                setPage(1);

                            }
                        }
                        className="
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

                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="title">
                            Title
                        </option>

                        <option value="featured">
                            Featured
                        </option>

                    </select>

                </div>


                <button
                    type="button"
                    onClick={
                        clearFilters
                    }
                    className="
                        mt-5
                        text-slate-400
                        hover:text-white
                        text-sm
                    "
                >

                    Clear Filters

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="
                    bg-red-500/10
                    border
                    border-red-500/30
                    text-red-400
                    rounded-lg
                    p-5
                    mb-8
                ">

                    {error}

                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="
                    flex
                    items-center
                    justify-center
                    py-20
                ">

                    <p className="
                        text-xl
                        text-slate-400
                    ">

                        Loading projects...

                    </p>

                </div>

            ) : projects.length === 0 ? (

                <div className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    p-12
                    text-center
                ">

                    <h2 className="
                        text-2xl
                        font-bold
                        mb-3
                    ">

                        No Projects Found

                    </h2>


                    <p className="
                        text-slate-400
                    ">

                        Try changing your
                        search or filters.

                    </p>

                </div>

            ) : (

                <>

                    {/* PROJECT GRID */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-6
                    ">

                        {projects.map(
                            (project) => (

                                <ProjectCard
                                    key={
                                        project._id
                                    }
                                    project={
                                        project
                                    }
                                />

                            )
                        )}

                    </div>


                    {/* PAGINATION */}

                    <div className="
                        flex
                        items-center
                        justify-center
                        gap-5
                        mt-10
                    ">


                        <button
                            type="button"
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    (previousPage) =>
                                        previousPage - 1
                                )
                            }
                            className="
                                bg-slate-800
                                hover:bg-slate-700
                                px-5
                                py-3
                                rounded-lg
                                disabled:opacity-30
                                disabled:cursor-not-allowed
                            "
                        >

                            ← Previous

                        </button>


                        <span className="
                            text-slate-300
                        ">

                            Page {page} of {totalPages}

                        </span>


                        <button
                            type="button"
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() =>
                                setPage(
                                    (previousPage) =>
                                        previousPage + 1
                                )
                            }
                            className="
                                bg-slate-800
                                hover:bg-slate-700
                                px-5
                                py-3
                                rounded-lg
                                disabled:opacity-30
                                disabled:cursor-not-allowed
                            "
                        >

                            Next →

                        </button>

                    </div>

                </>

            )}

        </div>

    );

}


export default Feed;