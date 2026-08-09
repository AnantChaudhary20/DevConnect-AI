import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getProjectById,
    updateProject,
    uploadProjectImage
} from "../../services/projectService";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
        githubUrl: "",
        liveUrl: "",
        category: "Web Development",
        status: "Planning"
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                const response =
                    await getProjectById(id);

                const project = response.project;

                setFormData({
                    title: project.title || "",
                    description: project.description || "",
                    tags: Array.isArray(project.tags)
                        ? project.tags.join(", ")
                        : "",
                    githubUrl: project.githubUrl || "",
                    liveUrl: project.liveUrl || "",
                    category: project.category || "Other",
                    status: project.status || "Planning"
                });

                setPreview(project.images?.[0] || "");
            } catch (requestError) {
                setError(
                    requestError?.response?.data?.message ||
                    "Failed to load project."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select an image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5MB.");
            return;
        }

        setError("");
        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const response =
                await updateProject(
                    id,
                    {
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                        tags: formData.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        githubUrl: formData.githubUrl.trim(),
                        liveUrl: formData.liveUrl.trim(),
                        category: formData.category,
                        status: formData.status
                    }
                );

            if (selectedImage) {
                await uploadProjectImage(
                    id,
                    selectedImage
                );
            }

            toast.success("Project updated.");
            navigate(`/project/${response.project._id}`);
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                "Failed to update project."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-slate-400">
                    Loading project...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h1 className="text-4xl font-bold mb-3">
                    Edit Project
                </h1>

                <p className="text-slate-400 mb-8">
                    Update the project details and showcase your latest work.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {[
                        ["title", "Project Title", "Your project name"],
                        ["githubUrl", "GitHub URL", "https://github.com/..."],
                        ["liveUrl", "Live URL", "https://..."]
                    ].map(([name, label, placeholder]) => (
                        <div key={name}>
                            <label className="block mb-2 font-semibold">
                                {label}
                            </label>
                            <input
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block mb-2 font-semibold">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={7}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">
                            Technologies
                        </label>
                        <input
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                        >
                            <option>Web Development</option>
                            <option>Mobile Development</option>
                            <option>AI / Machine Learning</option>
                            <option>Data Science</option>
                            <option>DevOps</option>
                            <option>Cybersecurity</option>
                            <option>Other</option>
                        </select>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                        >
                            <option>Planning</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-3 font-semibold">
                            Replace Project Image
                        </label>

                        {preview && (
                            <img
                                src={preview}
                                alt="Project preview"
                                className="w-full h-56 object-cover rounded-xl border border-slate-700 mb-4"
                            />
                        )}

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            className="text-slate-300"
                        />
                    </div>

                    <button
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProject;
