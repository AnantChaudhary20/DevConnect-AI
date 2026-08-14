import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getPublicProfile
} from "../../services/userService";

import FollowButton
    from "../../components/user/FollowButton";


function UserProfile() {

    const {
        userId
    } = useParams();


    const [user, setUser] =
        useState(null);

    const [projects, setProjects] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadProfile =
            async () => {

                try {

                    setLoading(true);


                    const response =
                        await getPublicProfile(
                            userId
                        );


                    setUser(
                        response.user
                    );


                    setProjects(
                        response.projects ||
                        []
                    );

                }

                catch (error) {

                    console.error(
                        "Public profile error:",
                        error
                    );


                    setError(
                        error?.response?.data?.message ||
                        "Failed to load profile."
                    );

                }

                finally {

                    setLoading(false);

                }

            };


        loadProfile();

    }, [userId]);


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


    if (error || !user) {

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

                    {error ||
                        "User not found."
                    }

                </div>

            </div>

        );

    }


    return (

        <div className="
            max-w-5xl
            mx-auto
            px-4 sm:px-6
            py-8 sm:py-10
        ">


            {/* PROFILE */}

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
                    gap-8
                ">


                    <img
                        src={
                            user.profilePicture ||
                            "https://via.placeholder.com/160?text=Developer"
                        }
                        alt={
                            user.name
                        }
                        className="
                            w-36
                            h-36
                            shrink-0
                            rounded-full
                            object-cover
                            object-center
                            border-4
                            border-slate-700
                        "
                    />


                    <div className="flex-1">


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


                            <FollowButton
                                userId={
                                    user._id
                                }
                            />

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


                        <div className="flex flex-wrap gap-6 mt-6">
                            <Link to={`/connections/${user._id}`} className="group rounded-xl p-2 -m-2 hover:bg-slate-800/70 transition">
                                <p className="text-2xl font-bold group-hover:text-blue-300">{user.followers?.length || 0}</p>
                                <p className="text-slate-400 text-sm">Followers</p>
                            </Link>
                            <Link to={`/connections/${user._id}`} className="group rounded-xl p-2 -m-2 hover:bg-slate-800/70 transition">
                                <p className="text-2xl font-bold group-hover:text-blue-300">{user.following?.length || 0}</p>
                                <p className="text-slate-400 text-sm">Following</p>
                            </Link>
                            <div className="rounded-xl p-2 -m-2">
                                <p className="text-2xl font-bold">{projects.length}</p>
                                <p className="text-slate-400 text-sm">Projects</p>
                            </div>
                        </div>

                    </div>

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

                        No skills added.

                    </p>

                )}

            </div>


            {/* LINKS */}

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


            {/* PROJECTS */}

            <div className="
                mt-6
            ">


                <h2 className="
                    text-3xl
                    font-bold
                    mb-6
                ">

                    Projects

                </h2>


                {projects.length === 0 ? (

                    <div className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-8
                    ">

                        <p className="
                            text-slate-400
                        ">

                            This developer
                            hasn't created
                            any projects yet.

                        </p>

                    </div>

                ) : (

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    ">


                        {projects.map(
                            project => (

                                <Link
                                    key={
                                        project._id
                                    }
                                    to={
                                        `/project/${project._id}`
                                    }
                                    className="
                                        bg-slate-900
                                        border
                                        border-slate-800
                                        rounded-2xl
                                        overflow-hidden
                                        hover:border-blue-500
                                        transition
                                    "
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


                                    <div className="p-5">

                                        <h3 className="
                                            text-xl
                                            font-bold
                                        ">

                                            {
                                                project.title
                                            }

                                        </h3>


                                        <p className="
                                            text-slate-400
                                            mt-3
                                            line-clamp-3
                                        ">

                                            {
                                                project.description
                                            }

                                        </p>

                                    </div>

                                </Link>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


export default UserProfile;