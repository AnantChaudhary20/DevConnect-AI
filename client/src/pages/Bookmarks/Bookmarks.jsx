import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import ProjectCard
    from "../../components/project/ProjectCard";

import api from "../../services/api";


function Bookmarks() {

    const [bookmarks, setBookmarks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadBookmarks = async () => {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem(
                    "token"
                );


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


            setBookmarks(
                response.data.bookmarks || []
            );

        }

        catch (error) {

            console.error(
                "Bookmarks error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to load bookmarks."
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadBookmarks();

    }, []);


    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-xl
                    text-slate-400
                ">

                    Loading bookmarks...

                </p>

            </div>

        );

    }


    if (error) {

        return (

            <div className="
                max-w-6xl
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

                    {error}

                </div>

            </div>

        );

    }


    return (

        <div className="
            max-w-7xl
            mx-auto
            px-6
            py-10
        ">


            {/* HEADER */}

            <div className="
                mb-10
            ">

                <h1 className="
                    text-4xl
                    font-bold
                ">

                    My Bookmarks

                </h1>


                <p className="
                    text-slate-400
                    mt-2
                ">

                    Projects you saved for later.

                </p>

            </div>


            {/* EMPTY STATE */}

            {bookmarks.length === 0 ? (

                <div className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    p-12
                    text-center
                ">

                    <div className="
                        text-5xl
                        mb-5
                    ">

                        🔖

                    </div>


                    <h2 className="
                        text-2xl
                        font-bold
                        mb-3
                    ">

                        No bookmarks yet

                    </h2>


                    <p className="
                        text-slate-400
                        mb-6
                    ">

                        Save interesting projects
                        and they will appear here.

                    </p>


                    <Link
                        to="/feed"
                        className="
                            inline-block
                            bg-blue-600
                            hover:bg-blue-700
                            px-6
                            py-3
                            rounded-lg
                            font-semibold
                        "
                    >

                        Explore Projects

                    </Link>

                </div>

            ) : (

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                ">

                    {bookmarks.map(
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

            )}

        </div>

    );

}


export default Bookmarks;