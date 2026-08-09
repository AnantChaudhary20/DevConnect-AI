import {
    useEffect,
    useState
} from "react";

import {
    toggleLikeProject
} from "../../services/projectService";


function LikeButton({
    project
}) {

    const [liked, setLiked] =
        useState(false);

    const [totalLikes, setTotalLikes] =
        useState(
            project?.likes?.length || 0
        );

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            return;

        }


        const currentUser =
            getCurrentUserFromToken(
                token
            );


        if (
            currentUser &&
            project?.likes
        ) {

            const isLiked =
                project.likes.some(
                    id => {

                        const likeId =
                            id?._id || id;

                        return (
                            likeId.toString() ===
                            currentUser.toString()
                        );

                    }
                );


            setLiked(
                isLiked
            );

        }


        setTotalLikes(
            project?.likes?.length || 0
        );

    }, [
        project
    ]);


    const handleLike = async () => {

        if (loading) {

            return;

        }


        try {

            setLoading(true);


            const response =
                await toggleLikeProject(
                    project._id
                );

            setLiked(
                response.liked
            );
            
            setTotalLikes(
                response.totalLikes
            );

        }

        catch (error) {

            console.error(
                "Like error:",
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
                handleLike
            }
            disabled={
                loading
            }
            className={`
                px-4
                py-2
                rounded-lg
                flex
                items-center
                gap-2
                transition
                disabled:opacity-50

                ${
                    liked
                        ? "bg-red-500/20 text-red-400"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }
            `}
        >

            <span>

                {liked
                    ? "❤️"
                    : "🤍"
                }

            </span>


            <span>

                {totalLikes}

            </span>

        </button>

    );

}


// ==========================================
// GET USER ID FROM JWT
// ==========================================

function getCurrentUserFromToken(
    token
) {

    try {

        const payload =
            token.split(".")[1];


        const decoded =
            JSON.parse(
                atob(payload)
            );


        return (
            decoded.userId ||
            decoded.id ||
            decoded._id ||
            null
        );

    }

    catch (error) {

        console.error(
            "Token decode error:",
            error
        );


        return null;

    }

}


export default LikeButton;