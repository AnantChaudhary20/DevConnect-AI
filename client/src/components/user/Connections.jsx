import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getConnections
} from "../../services/userService";


function Connections({
    userId
}) {

    const [followers, setFollowers] =
        useState([]);

    const [following, setFollowing] =
        useState([]);

    const [activeTab, setActiveTab] =
        useState("followers");

    const [loading, setLoading] =
        useState(true);


    const fetchConnections = async () => {

        try {

            setLoading(true);

            const response =
                await getConnections(userId);

            setFollowers(
                response.followers || []
            );

            setFollowing(
                response.following || []
            );

        } catch (error) {

            console.error(
                "Error loading connections:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (userId) {

            fetchConnections();

        }

    }, [userId]);


    const activeUsers =
        activeTab === "followers"
            ? followers
            : following;


    if (loading) {

        return (

            <div className="
                mt-10
                border-t
                border-slate-800
                pt-8
            ">

                <p className="
                    text-slate-400
                ">

                    Loading connections...

                </p>

            </div>

        );

    }


    return (

        <div className="
            mt-10
            border-t
            border-slate-800
            pt-8
        ">


            <h2 className="
                text-2xl
                font-bold
                mb-6
            ">

                Connections

            </h2>


            <div className="
                flex
                gap-3
                mb-6
            ">


                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            "followers"
                        )
                    }
                    className={`
                        px-5
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        ${
                            activeTab ===
                            "followers"
                                ? "bg-blue-600"
                                : "bg-slate-800 hover:bg-slate-700"
                        }
                    `}
                >

                    Followers ({followers.length})

                </button>


                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            "following"
                        )
                    }
                    className={`
                        px-5
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        ${
                            activeTab ===
                            "following"
                                ? "bg-blue-600"
                                : "bg-slate-800 hover:bg-slate-700"
                        }
                    `}
                >

                    Following ({following.length})

                </button>

            </div>


            {activeUsers.length === 0 ? (

                <div className="
                    bg-slate-800
                    rounded-xl
                    p-8
                    text-center
                ">

                    <p className="
                        text-slate-400
                    ">

                        {activeTab === "followers"
                            ? "No followers yet."
                            : "Not following anyone yet."
                        }

                    </p>

                </div>

            ) : (

                <div className="
                    grid
                    md:grid-cols-2
                    gap-4
                ">


                    {activeUsers.map(
                        (user) => (

                            <Link
                                key={user._id}
                                to={`/user/${user._id}`}
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    bg-slate-800
                                    hover:bg-slate-700
                                    rounded-xl
                                    p-4
                                    transition
                                "
                            >


                                <img
                                    src={
                                        user.profilePicture ||
                                        "https://via.placeholder.com/80?text=User"
                                    }
                                    alt={user.name}
                                    className="
                                        w-14
                                        h-14
                                        rounded-full
                                        object-cover
                                        border-2
                                        border-slate-700
                                    "
                                />


                                <div>

                                    <h3 className="
                                        font-semibold
                                        text-lg
                                    ">

                                        {user.name}

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-slate-400
                                    ">

                                        View Profile →

                                    </p>

                                </div>

                            </Link>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Connections;