import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import { deleteProject } from "../../services/projectService";


function DeleteProjectButton({ projectId }) {

    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleDelete = async () => {

        try {

            setLoading(true);

            setError("");


            await deleteProject(projectId);


            navigate("/feed");

        }

        catch (error) {

            console.error(
                "Delete project error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to delete project."
            );

        }

        finally {

            setLoading(false);

        }

    };


    if (!showConfirm) {

        return (

            <Button
                onClick={() =>
                    setShowConfirm(true)
                }
                className="
                    bg-red-600
                    hover:bg-red-700
                "
            >

                Delete

            </Button>

        );

    }


    return (

        <div className="
            flex
            flex-col
            gap-3
            bg-red-950/30
            border
            border-red-500/30
            rounded-xl
            p-4
        ">

            <p className="
                text-red-300
                font-semibold
            ">

                Are you sure you want
                to delete this project?

            </p>


            <p className="
                text-sm
                text-slate-400
            ">

                This action cannot be undone.

            </p>


            {error && (

                <p className="
                    text-sm
                    text-red-400
                ">

                    {error}

                </p>

            )}


            <div className="
                flex
                gap-3
            ">


                <Button
                    onClick={handleDelete}
                    disabled={loading}
                    className="
                        bg-red-600
                        hover:bg-red-700
                        disabled:opacity-50
                    "
                >

                    {loading
                        ? "Deleting..."
                        : "Yes, Delete"
                    }

                </Button>


                <Button
                    onClick={() =>
                        setShowConfirm(false)
                    }
                    disabled={loading}
                    className="
                        bg-slate-700
                        hover:bg-slate-600
                    "
                >

                    Cancel

                </Button>

            </div>

        </div>

    );

}


export default DeleteProjectButton;