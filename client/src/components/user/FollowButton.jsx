import {
    useEffect,
    useState
} from "react";

import {
    getProfile,
    toggleFollow
} from "../../services/userService";


function FollowButton({
    userId
}) {

    const [following, setFollowing] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        const checkFollowing =
            async () => {

                try {

                    const response =
                        await getProfile();


                    const currentUser =
                        response.user;


                    const isFollowing =
                        currentUser.following?.some(

                            id => {

                                const idValue =
                                    id._id ||
                                    id;

                                return (
                                    idValue.toString() ===
                                    userId.toString()
                                );

                            }

                        );


                    setFollowing(
                        Boolean(
                            isFollowing
                        )
                    );

                }

                catch (error) {

                    console.error(
                        "Follow check error:",
                        error
                    );

                }

            };


        checkFollowing();

    }, [userId]);


    const handleFollow =
        async () => {

            try {

                setLoading(true);


                const response =
                    await toggleFollow(
                        userId
                    );


                setFollowing(
                    !following
                );


                console.log(
                    response.message
                );

            }

            catch (error) {

                console.error(
                    "Follow error:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };


    return (

        <button
            type="button"
            onClick={
                handleFollow
            }
            disabled={
                loading
            }
            className="
                bg-blue-600
                hover:bg-blue-700
                px-6
                py-3
                rounded-lg
                font-semibold
                disabled:opacity-50
            "
        >

            {loading
                ? "..."
                : following
                    ? "Following"
                    : "Follow"
            }

        </button>

    );

}


export default FollowButton;