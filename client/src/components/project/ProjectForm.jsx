import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, uploadProjectImage } from "../../services/projectService";

const TECHNOLOGIES = [
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular",
    "Node.js", "Express", "NestJS", "Python", "Django", "Flask", "FastAPI", "Java",
    "Spring Boot", "C++", "C#", ".NET", "PHP", "Laravel", "Go", "Rust", "MongoDB",
    "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP", "Git", "GitHub", "Figma", "Tailwind CSS", "Bootstrap",
    "TensorFlow", "PyTorch", "OpenCV", "Pandas", "NumPy", "scikit-learn", "GraphQL", "REST API",
];

const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500";
const helperClass = "mt-2 text-sm leading-6 text-slate-500";

function FieldLabel({ children, optional = false }) {
    return (
        <div className="mb-2 flex items-center justify-between gap-3">
            <label className="font-semibold text-slate-100">{children}</label>
            {optional && <span className="text-xs text-slate-500">Optional</span>}
        </div>
    );
}

function ProjectForm() {
    const navigate = useNavigate();
    const technologyRef = useRef(null);
    const [technologiesOpen, setTechnologiesOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        category: "Web Development",
        status: "Planning",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (technologyRef.current && !technologyRef.current.contains(event.target)) {
                setTechnologiesOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const toggleTechnology = (technology) => {
        setFormData((previous) => ({
            ...previous,
            technologies: previous.technologies.includes(technology)
                ? previous.technologies.filter((item) => item !== technology)
                : [...previous.technologies, technology],
        }));
    };

    const removeTechnology = (technology) => {
        setFormData((previous) => ({
            ...previous,
            technologies: previous.technologies.filter((item) => item !== technology),
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid project image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Project image must be smaller than 5MB.");
            event.target.value = "";
            return;
        }

        if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        setError("");
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const validateForm = () => {
        if (formData.title.trim().length < 3) return "Project title must be at least 3 characters.";
        if (formData.description.trim().length < 10) return "Project description must be at least 10 characters.";

        const validUrl = /^(https?:\/\/).+/i;
        if (formData.githubUrl && !validUrl.test(formData.githubUrl.trim())) return "Please enter a valid GitHub URL.";
        if (formData.liveUrl && !validUrl.test(formData.liveUrl.trim())) return "Please enter a valid Live Demo URL.";
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const response = await createProject({
                title: formData.title.trim(),
                description: formData.description.trim(),
                tags: formData.technologies,
                githubUrl: formData.githubUrl.trim(),
                liveUrl: formData.liveUrl.trim(),
                category: formData.category,
                status: formData.status,
            });

            const project = response.project;
            if (selectedImage && project?._id) {
                await uploadProjectImage(project._id, selectedImage);
            }

            navigate(`/project/${project._id}`);
        } catch (requestError) {
            setError(requestError?.response?.data?.message || "Failed to create project.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (loading) return;
        navigate(-1);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/10">
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" />
                <div className="p-5 sm:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
                        <div>
                            <span className="text-sm font-semibold text-blue-400">Project showcase</span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Create Project</h1>
                            <p className="text-slate-400 mt-2 max-w-2xl leading-6">Share something you built with the DevConnect community.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="self-start sm:self-auto rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>

                    {error && <div className="mb-7 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300" role="alert">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div>
                            <FieldLabel>Project Title</FieldLabel>
                            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. DevConnect AI" className={inputClass} required />
                            <p className={helperClass}>Use a clear name that tells people what you built.</p>
                        </div>

                        <div>
                            <FieldLabel>Description</FieldLabel>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={7} placeholder="Explain what your project does, who it is for, and what you built." className={`${inputClass} resize-y min-h-40`} required />
                            <p className={helperClass}>Aim for a short but useful explanation. Mention the problem, solution, and key features.</p>
                        </div>

                        <div ref={technologyRef} className="relative">
                            <FieldLabel>Technologies</FieldLabel>
                            <button
                                type="button"
                                onClick={() => setTechnologiesOpen((open) => !open)}
                                className={`${inputClass} flex items-center justify-between gap-4 text-left`}
                                aria-expanded={technologiesOpen}
                            >
                                <span className={formData.technologies.length ? "text-white" : "text-slate-500"}>
                                    {formData.technologies.length ? `${formData.technologies.length} technologies selected` : "Select technologies"}
                                </span>
                                <span className="text-slate-400">{technologiesOpen ? "⌃" : "⌄"}</span>
                            </button>

                            {technologiesOpen && (
                                <div className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl shadow-black/40">
                                    <div className="max-h-72 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1">
                                        {TECHNOLOGIES.map((technology) => {
                                            const selected = formData.technologies.includes(technology);
                                            return (
                                                <button
                                                    type="button"
                                                    key={technology}
                                                    onClick={() => toggleTechnology(technology)}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${selected ? "bg-blue-500/15 text-blue-200" : "text-slate-300 hover:bg-slate-800"}`}
                                                >
                                                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${selected ? "border-blue-400 bg-blue-500 text-white" : "border-slate-600"}`}>
                                                        {selected ? "✓" : ""}
                                                    </span>
                                                    {technology}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                                        <span className="text-xs text-slate-500">Select as many as you need.</span>
                                        <button type="button" onClick={() => setFormData((previous) => ({ ...previous, technologies: [] }))} className="text-xs font-semibold text-slate-400 hover:text-white">Clear</button>
                                    </div>
                                </div>
                            )}

                            {formData.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.technologies.map((technology) => (
                                        <button type="button" key={technology} onClick={() => removeTechnology(technology)} className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-200 hover:bg-blue-500/20">
                                            {technology} <span className="text-blue-300">×</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <p className={helperClass}>Choose from common technologies instead of typing a comma-separated list.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel>Category</FieldLabel>
                                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                                    {[
                                        "Web Development", "Mobile Development", "AI / Machine Learning", "Data Science", "DevOps", "Cybersecurity", "Other",
                                    ].map((item) => <option key={item}>{item}</option>)}
                                </select>
                                <p className={helperClass}>Pick the category that best describes your project.</p>
                            </div>
                            <div>
                                <FieldLabel>Status</FieldLabel>
                                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                                    {[
                                        "Planning", "In Progress", "Completed",
                                    ].map((item) => <option key={item}>{item}</option>)}
                                </select>
                                <p className={helperClass}>Let other developers know where the project stands.</p>
                            </div>
                        </div>

                        <div>
                            <FieldLabel optional>GitHub URL</FieldLabel>
                            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username/project" className={inputClass} />
                            <p className={helperClass}>Add the repository so others can inspect the code.</p>
                        </div>

                        <div>
                            <FieldLabel optional>Live Demo URL</FieldLabel>
                            <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://myproject.com" className={inputClass} />
                            <p className={helperClass}>Link to the deployed project or demo.</p>
                        </div>

                        <div>
                            <FieldLabel optional>Project Image</FieldLabel>
                            <label className="group flex cursor-pointer flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border-2 border-dashed border-blue-400/60 bg-blue-500/10 px-5 py-5 transition hover:border-blue-300 hover:bg-blue-500/15">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-2xl font-bold text-white shadow-lg shadow-blue-600/20">↑</span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-bold text-blue-100">Choose File</span>
                                    <span className="block mt-1 text-sm text-blue-200/60">PNG, JPG or WEBP · Maximum 5MB</span>
                                    {selectedImage && <span className="block mt-1 truncate text-sm text-slate-200">Selected: {selectedImage.name}</span>}
                                </span>
                                <span className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 group-hover:bg-blue-500/20">Browse</span>
                                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="sr-only" />
                            </label>

                            {imagePreview && (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                                    <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-slate-300">Image Preview</div>
                                    <img src={imagePreview} alt="Project preview" className="h-64 sm:h-80 w-full object-cover object-center" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
                            <button type="button" onClick={handleCancel} disabled={loading} className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-base font-bold shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-50">
                                {loading ? "Creating Project…" : "Create Project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectForm;
