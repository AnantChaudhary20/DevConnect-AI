import {
    useEffect,
    useState
} from "react";

import {
    getProfile,
    toggleBookmark
} from "../../services/userService";


function BookmarkButton({
    project
}) {

    const [saved, setSaved] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        const checkBookmark =
            async () => {

                try {

                    const response =
                        await getProfile();


                    const user =
                        response.user;


                    const bookmarks =
                        user.bookmarks || [];


                    const isBookmarked =
                        bookmarks.some(
                            (bookmark) => {

                                const bookmarkId =
                                    bookmark._id ||
                                    bookmark;

                                return (
                                    bookmarkId.toString() ===
                                    project._id.toString()
                                );

                            }
                        );


                    setSaved(
                        isBookmarked
                    );

                }

                catch (error) {

                    console.error(
                        "Bookmark check error:",
                        error
                    );

                }

            };


        checkBookmark();

    }, [
        project._id
    ]);


    const handleBookmark = async () => {

        try {

            setLoading(true);


            const response =
                await toggleBookmark(
                    project._id
                );


            setSaved(
                !saved
            );


            console.log(
                response.message
            );

        }

        catch (error) {

            console.error(
                "Bookmark error:",
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
                handleBookmark
            }
            disabled={loading}
            className="
                bg-slate-800
                hover:bg-slate-700
                px-4
                py-2
                rounded-lg
                text-sm
                disabled:opacity-50
            "
        >

            {saved
                ? "🔖 Saved"
                : "🔖 Save"
            }

        </button>

    );

}


export default BookmarkButton;