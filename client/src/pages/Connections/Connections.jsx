import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import api from "../../services/api";


function Connections() {

    const { userId } = useParams();


    const [followers, setFollowers] =
        useState([]);

    const [following, setFollowing] =
        useState([]);


    const [activeTab, setActiveTab] =
        useState("followers");


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadConnections =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await api.get(
                            `/users/connections/${userId}`
                        );


                    setFollowers(
                        response.data.followers || []
                    );


                    setFollowing(
                        response.data.following || []
                    );

                }

                catch (error) {

                    console.error(
                        "Connections error:",
                        error
                    );


                    setError(
                        error?.response?.data?.message ||
                        "Failed to load connections."
                    );

                }

                finally {

                    setLoading(false);

                }

            };


        loadConnections();

    }, [userId]);


    const users =
        activeTab === "followers"
            ? followers
            : following;


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

                    Loading connections...

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
            max-w-4xl
            mx-auto
            px-6
            py-10
        ">


            {/* HEADER */}

            <div className="
                mb-8
            ">

                <h1 className="
                    text-4xl
                    font-bold
                ">

                    Connections

                </h1>


                <p className="
                    text-slate-400
                    mt-2
                ">

                    View followers and developers
                    you are following.

                </p>

            </div>


            {/* TABS */}

            <div className="
                flex
                gap-3
                mb-8
            ">


                <button
                    onClick={() =>
                        setActiveTab(
                            "followers"
                        )
                    }
                    className={`
                        px-6
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        ${
                            activeTab ===
                            "followers"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }
                    `}
                >

                    Followers

                    <span className="
                        ml-2
                        opacity-70
                    ">

                        {followers.length}

                    </span>

                </button>


                <button
                    onClick={() =>
                        setActiveTab(
                            "following"
                        )
                    }
                    className={`
                        px-6
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        ${
                            activeTab ===
                            "following"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }
                    `}
                >

                    Following

                    <span className="
                        ml-2
                        opacity-70
                    ">

                        {following.length}

                    </span>

                </button>

            </div>


            {/* USERS */}

            {users.length === 0 ? (

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

                        👥

                    </div>


                    <h2 className="
                        text-2xl
                        font-bold
                        mb-3
                    ">

                        No{" "}

                        {activeTab ===
                        "followers"
                            ? "followers"
                            : "following"
                        }

                        {" "}yet

                    </h2>


                    <p className="
                        text-slate-400
                    ">

                        {activeTab ===
                        "followers"
                            ? "When developers follow this user, they will appear here."
                            : "Users this developer follows will appear here."
                        }

                    </p>

                </div>

            ) : (

                <div className="
                    space-y-4
                ">

                    {users.map(
                        (user) => (

                            <div
                                key={
                                    user._id
                                }
                                className="
                                    bg-slate-900
                                    border
                                    border-slate-800
                                    rounded-xl
                                    p-5
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >


                                {/* USER */}

                                <div className="
                                    flex
                                    items-center
                                    gap-4
                                ">


                                    <img
                                        src={
                                            user.profilePicture ||
                                            "https://via.placeholder.com/80?text=User"
                                        }
                                        alt={
                                            user.name
                                        }
                                        className="
                                            w-14
                                            h-14
                                            rounded-full
                                            object-cover
                                            border
                                            border-slate-700
                                        "
                                    />


                                    <div>

                                        <h3 className="
                                            font-bold
                                            text-lg
                                        ">

                                            {
                                                user.name
                                            }

                                        </h3>


                                        <p className="
                                            text-slate-500
                                            text-sm
                                        ">

                                            Developer

                                        </p>

                                    </div>

                                </div>


                                {/* VIEW PROFILE */}

                                <Link
                                    to={
                                        `/user/${user._id}`
                                    }
                                    className="
                                        bg-blue-600
                                        hover:bg-blue-700
                                        px-5
                                        py-2
                                        rounded-lg
                                        font-semibold
                                        transition
                                    "
                                >

                                    View Profile

                                </Link>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Connections;