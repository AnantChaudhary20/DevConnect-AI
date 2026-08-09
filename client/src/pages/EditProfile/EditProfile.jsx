import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    useNavigate
} from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

import api from "../../services/api";

import {
    setUser
} from "../../redux/slices/authSlice";


function EditProfile() {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const user =
        useSelector(
            (state) => state.auth.user
        );


    const [formData, setFormData] =
        useState({

            name: "",
            bio: "",
            skills: "",
            github: "",
            linkedin: "",
            portfolio: "",
            location: ""

        });


    const [profilePicture, setProfilePicture] =
        useState(null);


    const [preview, setPreview] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [uploadingImage, setUploadingImage] =
        useState(false);


    const [message, setMessage] =
        useState("");


    const [error, setError] =
        useState("");


    useEffect(() => {

        if (!user) {

            return;

        }


        setFormData({

            name: user.name || "",

            bio: user.bio || "",

            skills:
                Array.isArray(user.skills)
                    ? user.skills.join(", ")
                    : "",

            github: user.github || "",

            linkedin: user.linkedin || "",

            portfolio:
                user.portfolio || "",

            location:
                user.location || ""

        });


        setPreview(
            user.profilePicture || ""
        );

    }, [user]);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value

            })
        );

    };


    const handleImageChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        setProfilePicture(file);


        const imageUrl =
            URL.createObjectURL(file);


        setPreview(imageUrl);

    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        try {

            setLoading(true);

            setMessage("");

            setError("");


            const token =
                localStorage.getItem(
                    "token"
                );


            const updatedData = {

                name:
                    formData.name,

                bio:
                    formData.bio,

                skills:
                    formData.skills
                        .split(",")
                        .map(
                            skill =>
                                skill.trim()
                        )
                        .filter(
                            skill =>
                                skill.length > 0
                        ),

                github:
                    formData.github,

                linkedin:
                    formData.linkedin,

                portfolio:
                    formData.portfolio,

                location:
                    formData.location

            };


            const response =
                await api.put(

                    "/users/profile",

                    updatedData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            dispatch(
                setUser(
                    response.data.user
                )
            );


            setMessage(
                "Profile updated successfully."
            );

        }

        catch (error) {

            console.error(
                "Profile update error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to update profile."
            );

        }

        finally {

            setLoading(false);

        }

    };


    const handleUploadProfilePicture =
        async () => {

            if (!profilePicture) {

                setError(
                    "Please select an image first."
                );

                return;

            }


            try {

                setUploadingImage(true);

                setMessage("");

                setError("");


                const token =
                    localStorage.getItem(
                        "token"
                    );


                const data =
                    new FormData();


                data.append(
                    "profilePicture",
                    profilePicture
                );


                const response =
                    await api.post(

                        "/users/upload-profile-picture",

                        data,

                        {
                            headers: {

                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "multipart/form-data"

                            }

                        }

                    );


                setPreview(
                    response.data.profilePicture
                );


                dispatch(
                    setUser({

                        ...user,

                        profilePicture:
                            response.data.profilePicture

                    })
                );


                setProfilePicture(null);


                setMessage(
                    "Profile picture updated successfully."
                );

            }

            catch (error) {

                console.error(
                    "Profile picture error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Failed to upload profile picture."
                );

            }

            finally {

                setUploadingImage(false);

            }

        };


    return (

        <div className="
            max-w-3xl
            mx-auto
            px-6
            py-10
        ">


            <Card>


                {/* HEADER */}

                <div className="
                    mb-8
                ">

                    <h1 className="
                        text-4xl
                        font-bold
                    ">

                        Edit Profile

                    </h1>


                    <p className="
                        text-slate-400
                        mt-2
                    ">

                        Update your developer profile.

                    </p>

                </div>


                {/* MESSAGES */}

                {message && (

                    <div className="
                        mb-6
                        rounded-lg
                        border
                        border-green-500/30
                        bg-green-500/10
                        text-green-400
                        p-4
                    ">

                        {message}

                    </div>

                )}


                {error && (

                    <div className="
                        mb-6
                        rounded-lg
                        border
                        border-red-500/30
                        bg-red-500/10
                        text-red-400
                        p-4
                    ">

                        {error}

                    </div>

                )}


                {/* PROFILE PICTURE */}

                <div className="
                    mb-8
                    pb-8
                    border-b
                    border-slate-800
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        mb-5
                    ">

                        Profile Picture

                    </h2>


                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        gap-6
                    ">


                        <img
                            src={
                                preview ||
                                "https://via.placeholder.com/120?text=User"
                            }
                            alt="Profile"
                            className="
                                w-28
                                h-28
                                rounded-full
                                object-cover
                                border
                                border-slate-700
                            "
                        />


                        <div className="
                            flex
                            flex-col
                            gap-3
                        ">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                                className="
                                    text-slate-300
                                "
                            />


                            <Button
                                type="button"
                                onClick={
                                    handleUploadProfilePicture
                                }
                                disabled={
                                    uploadingImage ||
                                    !profilePicture
                                }
                                className="
                                    bg-blue-600
                                    hover:bg-blue-700
                                    disabled:opacity-50
                                "
                            >

                                {uploadingImage
                                    ? "Uploading..."
                                    : "Upload Picture"
                                }

                            </Button>

                        </div>

                    </div>

                </div>


                {/* PROFILE FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-6
                    "
                >


                    {/* NAME */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Name

                        </label>


                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Your name"
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* BIO */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Bio

                        </label>


                        <textarea
                            name="bio"
                            value={
                                formData.bio
                            }
                            onChange={
                                handleChange
                            }
                            rows="5"
                            placeholder="
                                Tell other developers about yourself...
                            "
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                                resize-none
                            "
                        />

                    </div>


                    {/* SKILLS */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Skills

                        </label>


                        <input
                            type="text"
                            name="skills"
                            value={
                                formData.skills
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                Python, React, Node.js, MongoDB
                            "
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "
                        />


                        <p className="
                            text-sm
                            text-slate-500
                            mt-2
                        ">

                            Separate skills with commas.

                        </p>

                    </div>


                    {/* GITHUB */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            GitHub

                        </label>


                        <input
                            type="url"
                            name="github"
                            value={
                                formData.github
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                https://github.com/username
                            "
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* LINKEDIN */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            LinkedIn

                        </label>


                        <input
                            type="url"
                            name="linkedin"
                            value={
                                formData.linkedin
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                https://linkedin.com/in/username
                            "
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* PORTFOLIO */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Portfolio

                        </label>


                        <input
                            type="url"
                            name="portfolio"
                            value={
                                formData.portfolio
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                https://yourportfolio.com
                            "
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* LOCATION */}

                    <div>

                        <label className="
                            block
                            mb-2
                            font-semibold
                        ">

                            Location

                        </label>


                        <input
                            type="text"
                            name="location"
                            value={
                                formData.location
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="
                                New Delhi, India
                            "
                            className="
                                w-full
                                rounded-lg
                                bg-slate-800
                                border
                                border-slate-700
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="
                        flex
                        flex-wrap
                        gap-4
                        pt-4
                    ">


                        <Button
                            type="submit"
                            disabled={loading}
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </Button>


                        <Button
                            type="button"
                            onClick={() =>
                                navigate("/profile")
                            }
                            className="
                                bg-slate-700
                                hover:bg-slate-600
                            "
                        >

                            Cancel

                        </Button>

                    </div>

                </form>

            </Card>

        </div>

    );

}


export default EditProfile;