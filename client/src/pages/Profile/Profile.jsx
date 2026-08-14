import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getProfile
} from "../../services/userService";


function Profile() {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const fetchProfile = async () => {

        try {

            setLoading(true);

            const response =
                await getProfile();


            setUser(
                response.user
            );

        }

        catch (error) {

            console.error(
                "Profile error:",
                error
            );


            setError(
                "Failed to load profile."
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProfile();

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

                    Loading profile...

                </p>

            </div>

        );

    }


    if (error) {

        return (

            <div className="
                max-w-4xl
                mx-auto
                px-6
                py-10
            ">

                <div className="
                    bg-red-500/10
                    border
                    border-red-500/30
                    text-red-400
                    rounded-lg
                    p-5
                ">

                    {error}

                </div>

            </div>

        );

    }


    if (!user) {

        return null;

    }


    return (

        <div className="
            max-w-5xl
            mx-auto
            px-4 sm:px-6
            py-8 sm:py-10
        ">


            {/* PROFILE HEADER */}

            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-8
            ">


                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    gap-8
                ">


                    {/* PROFILE IMAGE */}

                    <div>

                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-36 h-36 rounded-full object-cover border-4 border-slate-700" />
                        ) : (
                            <div className="w-36 h-36 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-center px-3">No photo</div>
                        )}

                    </div>


                    {/* PROFILE INFO */}

                    <div className="
                        flex-1
                    ">


                        <div className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-4
                        ">


                            <div>

                                <h1 className="
                                    text-4xl
                                    font-bold
                                ">

                                    {user.name}

                                </h1>


                                {user.location && (

                                    <p className="
                                        text-slate-400
                                        mt-2
                                    ">

                                        📍{" "}
                                        {
                                            user.location
                                        }

                                    </p>

                                )}

                            </div>


                            <Link
                                to="/edit-profile"
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

                                Edit Profile

                            </Link>

                        </div>


                        {user.bio && (

                            <p className="
                                text-slate-300
                                mt-5
                                leading-7
                            ">

                                {user.bio}

                            </p>

                        )}


                        {/* CONNECTION COUNTS */}

                        <div className="
                            flex
                            gap-8
                            mt-6
                        ">


                            <div>

                                <p className="
                                    text-2xl
                                    font-bold
                                ">

                                    {
                                        user.followers?.length ||
                                        0
                                    }

                                </p>


                                <p className="
                                    text-slate-400
                                    text-sm
                                ">

                                    Followers

                                </p>

                            </div>


                            <div>

                                <p className="
                                    text-2xl
                                    font-bold
                                ">

                                    {
                                        user.following?.length ||
                                        0
                                    }

                                </p>


                                <p className="
                                    text-slate-400
                                    text-sm
                                ">

                                    Following

                                </p>

                            </div>


                            <div>

                                <p className="
                                    text-2xl
                                    font-bold
                                ">

                                    {
                                        user.bookmarks?.length ||
                                        0
                                    }

                                </p>


                                <p className="
                                    text-slate-400
                                    text-sm
                                ">

                                    Bookmarks

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* SOCIAL LINKS */}

            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-8
                mt-6
            ">


                <h2 className="
                    text-2xl
                    font-bold
                    mb-5
                ">

                    Developer Links

                </h2>


                <div className="
                    flex
                    flex-wrap
                    gap-4
                ">


                    {user.github && (

                        <a
                            href={
                                user.github
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                bg-slate-800
                                hover:bg-slate-700
                                px-5
                                py-3
                                rounded-lg
                            "
                        >

                            GitHub

                        </a>

                    )}


                    {user.linkedin && (

                        <a
                            href={
                                user.linkedin
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                bg-slate-800
                                hover:bg-slate-700
                                px-5
                                py-3
                                rounded-lg
                            "
                        >

                            LinkedIn

                        </a>

                    )}


                    {user.portfolio && (

                        <a
                            href={
                                user.portfolio
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                px-5
                                py-3
                                rounded-lg
                            "
                        >

                            Portfolio

                        </a>

                    )}

                </div>

            </div>


            {/* SKILLS */}

            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-8
                mt-6
            ">


                <h2 className="
                    text-2xl
                    font-bold
                    mb-5
                ">

                    Skills

                </h2>


                {user.skills?.length > 0 ? (

                    <div className="
                        flex
                        flex-wrap
                        gap-3
                    ">


                        {user.skills.map(
                            (
                                skill,
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

                                    {skill}

                                </span>

                            )
                        )}

                    </div>

                ) : (

                    <p className="
                        text-slate-400
                    ">

                        No skills added yet.

                    </p>

                )}

            </div>


            {/* PROJECTS */}

            <div className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-8
                mt-6
            ">


                <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                ">


                    <h2 className="
                        text-2xl
                        font-bold
                    ">

                        My Projects

                    </h2>


                    <Link
                        to="/create-project"
                        className="
                            text-blue-400
                            hover:text-blue-300
                        "
                    >

                        + Create

                    </Link>

                </div>


                <p className="
                    text-slate-400
                ">

                    Open your projects from
                    the Feed to view and manage
                    them.

                </p>

            </div>

        </div>

    );

}


export default Profile;