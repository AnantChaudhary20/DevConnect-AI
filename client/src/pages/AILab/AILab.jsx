import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    analyzeResumePdf,
    getDeveloperRecommendations,
    getIntelligenceHealth,
    runAlgorithmDemo,
} from "../../services/intelligenceService";

const roleOptions = [
    { value: "full stack developer", label: "Full Stack Developer" },
    { value: "software engineer", label: "Software Engineer" },
    { value: "backend developer", label: "Backend Developer" },
];

const demoPayload = {
    numbers: [42, 7, 19, 3, 31, 12],
    target: 19,
    first: "developer",
    second: "develop",
    capacity: 10,
    items: [
        { name: "DSA", value: 10, effort: 5 },
        { name: "React", value: 7, effort: 4 },
        { name: "Git", value: 4, effort: 2 },
    ],
};

function AILab() {
    const [resumeFile, setResumeFile] = useState(null);
    const [targetRole, setTargetRole] = useState("full stack developer");
    const [analysis, setAnalysis] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [algorithmResult, setAlgorithmResult] = useState(null);
    const [loadingAction, setLoadingAction] = useState("");
    const [health, setHealth] = useState(null);

    const loadHealth = async () => {
        try {
            const response = await getIntelligenceHealth();
            setHealth(response);
        } catch (error) {
            setHealth({
                success: false,
                python: {
                    reachable: false,
                    message:
                        error?.response?.data?.python?.message ||
                        error?.response?.data?.message ||
                        "AI service is unreachable.",
                },
            });
        }
    };

    useEffect(() => {
        loadHealth();
    }, []);

    const handlePdfUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            toast.error("Only PDF files are accepted.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("PDF must be smaller than 5MB.");
            return;
        }

        setResumeFile(file);
        setAnalysis(null);
        setLoadingAction("resume");

        try {
            const response = await analyzeResumePdf(file, targetRole);
            setAnalysis(response.analysis);
            toast.success("Resume analyzed successfully.");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Could not analyze the PDF resume."
            );
        } finally {
            setLoadingAction("");
            loadHealth();
        }
    };

    const handleRecommendations = async () => {
        setLoadingAction("recommendations");

        try {
            const response = await getDeveloperRecommendations(6);
            setRecommendations(response.recommendations || []);

            if ((response.recommendations || []).length === 0) {
                toast("Add a few skills to your profile to get better matches.");
            } else {
                toast.success("Developer matches updated.");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Could not load developer matches."
            );
        } finally {
            setLoadingAction("");
            loadHealth();
        }
    };

    const handleAlgorithmDemo = async () => {
        setLoadingAction("algorithms");

        try {
            const response = await runAlgorithmDemo(demoPayload);
            setAlgorithmResult(response);
            toast.success("DSA playground completed successfully.");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "DSA playground failed."
            );
        } finally {
            setLoadingAction("");
            loadHealth();
        }
    };

    const online = Boolean(health?.python?.reachable);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-6 sm:p-8 mb-6">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="relative">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                                Python Intelligence
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">DevConnect AI Lab</h1>
                            <p className="text-slate-400 mt-3 max-w-3xl leading-7">
                                Work with your resume, discover developers with similar skills, and experiment with core DSA algorithms from one place.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={loadHealth}
                            className="self-start lg:self-auto rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-blue-500/50 hover:bg-slate-800 transition"
                        >
                            Refresh status
                        </button>
                    </div>

                    <div className={`mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border px-4 py-4 text-sm ${online ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>
                        <div>
                            <strong>AI service:</strong> {online ? "Online and reachable" : "Offline or unavailable"}
                            {health?.python?.message ? ` — ${health.python.message}` : ""}
                        </div>
                        <span className="text-xs break-all opacity-70">
                            {health?.python?.serviceUrl || "Python service URL not reported"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-7 shadow-2xl shadow-black/10">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-blue-400">1 · Resume</p>
                            <h2 className="text-2xl font-bold mt-1">PDF Resume Analyzer</h2>
                        </div>
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">PDF only</span>
                    </div>
                    <p className="text-slate-400 mt-3 leading-6">
                        Upload a text-based PDF resume and compare its skills with a target role using the Python analyzer.
                    </p>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">Target role</label>
                            <select
                                value={targetRole}
                                onChange={(event) => setTargetRole(event.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                {roleOptions.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>

                        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-500/50 bg-blue-500/5 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-500/10">
                            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl text-blue-300">↑</span>
                            <span className="text-lg font-bold text-blue-100">Choose PDF resume</span>
                            <span className="mt-1 text-sm text-slate-500">Maximum 5MB · PDF format only</span>
                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handlePdfUpload}
                                disabled={loadingAction === "resume"}
                                className="sr-only"
                            />
                        </label>

                        {resumeFile && (
                            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-200 truncate">{resumeFile.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">PDF selected</p>
                                </div>
                                {loadingAction === "resume" && <span className="text-xs font-semibold text-blue-300">Analyzing…</span>}
                            </div>
                        )}
                    </div>

                    {analysis && (
                        <div className="mt-7 space-y-5">
                            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-slate-950 p-5">
                                <p className="text-sm text-slate-400">ATS skill score</p>
                                <div className="flex items-end gap-3 mt-1">
                                    <span className="text-5xl font-extrabold text-white">{analysis.score}</span>
                                    <span className="text-slate-400 mb-2">/ 100</span>
                                </div>
                            </div>
                            {[
                                ["Matched skills", analysis.matchedSkills || [], "emerald"],
                                ["Missing skills", analysis.missingSkills || [], "red"],
                                ["Recommended next skills", analysis.recommendedNextSkills || [], "blue"],
                            ].map(([label, skills, tone]) => (
                                <div key={label}>
                                    <p className="text-sm font-semibold text-slate-300">{label}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.length > 0 ? skills.map((skill) => (
                                            <span key={skill} className={`px-3 py-1.5 rounded-full border text-sm ${tone === "emerald" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : tone === "red" ? "bg-red-500/10 border-red-500/20 text-red-300" : "bg-blue-500/10 border-blue-500/20 text-blue-300"}`}>
                                                {skill}
                                            </span>
                                        )) : <span className="text-sm text-slate-500">None found.</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-7 shadow-2xl shadow-black/10">
                    <p className="text-sm font-semibold text-purple-400">2 · Discover</p>
                    <h2 className="text-2xl font-bold mt-1">Find Developers</h2>
                    <p className="text-slate-400 mt-3 leading-6">
                        Match your profile skills with other developers and see the skills you have in common.
                    </p>

                    <button
                        type="button"
                        onClick={handleRecommendations}
                        disabled={Boolean(loadingAction)}
                        className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loadingAction === "recommendations" ? "Finding developers…" : "Find Developers"}
                    </button>

                    <div className="mt-6 space-y-3">
                        {recommendations.length === 0 ? (
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                                <p className="font-semibold text-slate-300">No matches loaded yet</p>
                                <p className="mt-2 text-sm text-slate-500">Use the button above to search for developers with overlapping skills.</p>
                            </div>
                        ) : recommendations.map((item) => (
                            <div key={item.user._id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:border-purple-500/30 transition">
                                <div className="flex items-center gap-4">
                                    <img src={item.user.profilePicture || "https://via.placeholder.com/80?text=User"} alt={item.user.name} className="h-12 w-12 rounded-full object-cover object-center border border-slate-700" />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold truncate">{item.user.name}</h3>
                                        <p className="text-sm text-slate-400 mt-1 truncate">{(item.matchedSkills || []).join(", ") || "Related skills"}</p>
                                    </div>
                                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-300">{item.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-7">
                        <p className="text-sm font-semibold text-purple-400">3 · Practice</p>
                        <h3 className="text-xl font-bold mt-1">DSA Playground</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-6">
                            Run merge sort, binary search, longest common subsequence, and 0/1 knapsack in the Python service.
                        </p>
                        <button
                            type="button"
                            onClick={handleAlgorithmDemo}
                            disabled={Boolean(loadingAction)}
                            className="mt-5 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-semibold transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loadingAction === "algorithms" ? "Running algorithms…" : "Run DSA Demo"}
                        </button>

                        {algorithmResult && (
                            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                                <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-slate-300">Algorithm output</div>
                                <pre className="max-h-80 overflow-auto p-4 text-xs sm:text-sm text-slate-300">{JSON.stringify(algorithmResult, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AILab;
