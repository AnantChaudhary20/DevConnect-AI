import { useEffect, useState } from "react";

import {
    getComments,
    addComment,
    deleteComment
} from "../../services/commentService";

function CommentSection({ projectId }) {

    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {

        try {

            setLoading(true);

            const response = await getComments(projectId);

            setComments(response.comments || []);

        } catch (error) {

            console.error(
                "Error fetching comments:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchComments();

    }, [projectId]);

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!text.trim()) {

            return;

        }

        try {

            setSubmitting(true);

            const response = await addComment(
                projectId,
                text
            );

            setComments((previousComments) => [

                response.comment,

                ...previousComments

            ]);

            setText("");

        } catch (error) {

            console.error(
                "Error adding comment:",
                error
            );

        } finally {

            setSubmitting(false);

        }

    };

    const handleDelete = async (commentId) => {

        try {

            await deleteComment(commentId);

            setComments((previousComments) =>

                previousComments.filter(
                    (comment) =>
                        comment._id !== commentId
                )

            );

        } catch (error) {

            console.error(
                "Error deleting comment:",
                error
            );

        }

    };

    return (

        <div className="mt-8">

            <h2 className="text-2xl font-bold mb-5">

                Comments

            </h2>

            <form
                onSubmit={handleSubmit}
                className="flex gap-3 mb-8"
            >

                <input
                    type="text"
                    value={text}
                    onChange={(event) =>
                        setText(event.target.value)
                    }
                    placeholder="Write a comment..."
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
                    disabled={submitting}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        px-5
                        py-3
                        rounded-lg
                        font-semibold
                        disabled:opacity-50
                    "
                >

                    {submitting
                        ? "Posting..."
                        : "Comment"
                    }

                </button>

            </form>

            {loading ? (

                <p className="text-slate-400">

                    Loading comments...

                </p>

            ) : comments.length === 0 ? (

                <p className="text-slate-400">

                    No comments yet.

                </p>

            ) : (

                <div className="space-y-4">

                    {comments.map((comment) => (

                        <div
                            key={comment._id}
                            className="
                                bg-slate-800
                                border
                                border-slate-700
                                rounded-xl
                                p-4
                            "
                        >

                            <div className="flex justify-between">

                                <div>

                                    <p className="font-semibold">

                                        {comment.user?.name ||
                                            "Developer"
                                        }

                                    </p>

                                    <p className="text-slate-300 mt-2">

                                        {comment.text}

                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            comment._id
                                        )
                                    }
                                    className="
                                        text-red-400
                                        hover:text-red-300
                                        text-sm
                                    "
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default CommentSection;