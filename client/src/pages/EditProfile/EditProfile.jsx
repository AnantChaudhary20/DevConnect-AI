import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import api from "../../services/api";
import { setUser } from "../../redux/slices/authSlice";

const LOCATIONS = [
    "New Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Chandigarh", "Dehradun", "Agra", "Noida", "Gurugram", "Indore", "Bhopal", "Kochi", "Patna", "Bhubaneswar",
    "Remote", "Other"
];

const GITHUB_PATTERN = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/;
const LINKEDIN_PATTERN = /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9._-]+\/?$/;

function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [formData, setFormData] = useState({ name: "", bio: "", skills: "", github: "", linkedin: "", portfolio: "", location: "" });
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;
        setFormData({
            name: user.name || "",
            bio: user.bio || "",
            skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
            github: user.github || "",
            linkedin: user.linkedin || "",
            portfolio: user.portfolio || "",
            location: user.location || ""
        });
        setPreview(user.profilePicture || "");
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Profile picture must be smaller than 5MB.");
            return;
        }
        setError("");
        setProfilePicture(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            if (!formData.location) throw new Error("Please select a location.");
            if (formData.github && !GITHUB_PATTERN.test(formData.github.trim())) throw new Error("GitHub URL must be https://github.com/username");
            if (formData.linkedin && !LINKEDIN_PATTERN.test(formData.linkedin.trim())) throw new Error("LinkedIn URL must be https://www.linkedin.com/in/username");

            const token = localStorage.getItem("token");
            const updatedData = {
                name: formData.name.trim(),
                bio: formData.bio.trim(),
                skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
                github: formData.github.trim(),
                linkedin: formData.linkedin.trim(),
                portfolio: formData.portfolio.trim(),
                location: formData.location
            };

            const response = await api.put("/users/profile", updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch(setUser(response.data.user));
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadProfilePicture = async () => {
        if (!profilePicture) {
            setError("Please select an image first.");
            return;
        }
        setUploadingImage(true);
        setMessage("");
        setError("");
        try {
            const token = localStorage.getItem("token");
            const data = new FormData();
            data.append("profilePicture", profilePicture);
            const response = await api.post("/users/upload-profile-picture", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setPreview(response.data.profilePicture);
            dispatch(setUser({ ...user, profilePicture: response.data.profilePicture }));
            setProfilePicture(null);
            setMessage("Profile picture updated successfully.");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to upload profile picture.");
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <Card>
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold">Edit Profile</h1>
                    <p className="text-slate-400 mt-2">Update your developer profile.</p>
                </div>

                {message && <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 p-4">{message}</div>}
                {error && <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 p-4">{error}</div>}

                <div className="mb-8 pb-8 border-b border-slate-800">
                    <h2 className="text-xl font-bold mb-5">Profile Picture</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {preview ? (
                            <img src={preview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-2 border-slate-700" />
                        ) : (
                            <div className="w-28 h-28 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 text-center font-semibold px-3">
                                No photo
                            </div>
                        )}

                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                            <label htmlFor="profile-picture-upload" className="inline-flex items-center justify-center gap-3 w-full cursor-pointer rounded-xl border-2 border-dashed border-blue-500/60 bg-blue-500/10 px-6 py-4 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400 transition font-semibold text-center">
                                <span className="text-2xl">+</span>
                                Choose Profile Picture
                            </label>
                            <input id="profile-picture-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="sr-only" />
                            <Button type="button" onClick={handleUploadProfilePicture} disabled={uploadingImage || !profilePicture} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                                {uploadingImage ? "Uploading..." : "Upload Picture"}
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-semibold">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="5" placeholder="Tell other developers about yourself..." className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 resize-none" />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Skills</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, React, Node.js, MongoDB" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500" />
                        <p className="text-sm text-slate-500 mt-2">Separate skills with commas.</p>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">GitHub</label>
                        <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" pattern="https://github\\.com/[A-Za-z0-9-]+/?" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500" />
                        <p className="text-sm text-slate-500 mt-2">Only https://github.com/username is accepted.</p>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">LinkedIn</label>
                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://www.linkedin.com/in/username" pattern="https://www\\.linkedin\\.com/in/[A-Za-z0-9._-]+/?" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500" />
                        <p className="text-sm text-slate-500 mt-2">Only https://www.linkedin.com/in/username is accepted.</p>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Portfolio</label>
                        <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="profile-location" className="block mb-2 font-semibold">Location</label>
                        <select id="profile-location" name="location" value={formData.location} onChange={handleChange} required className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 text-white">
                            <option value="">Select your location</option>
                            {LOCATIONS.map((location) => <option key={location} value={location}>{location}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button type="button" onClick={() => navigate("/profile")} className="bg-slate-800 hover:bg-slate-700 w-full sm:w-auto">Cancel</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default EditProfile;
