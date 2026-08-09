import { useState } from "react";
import toast from "react-hot-toast";

import {
    analyzeResume,
    getDeveloperRecommendations,
    runAlgorithmDemo
} from "../../services/intelligenceService";

function AILab() {
    const [resumeText, setResumeText] = useState("");
    const [targetRole, setTargetRole] =
        useState("full stack developer");
    const [analysis, setAnalysis] = useState(null);
    const [recommendations, setRecommendations] =
        useState([]);
    const [algorithmResult, setAlgorithmResult] =
        useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response =
                await analyzeResume(
                    resumeText,
                    targetRole
                );

            setAnalysis(response.analysis);
            toast.success("Resume analyzed.");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Resume analysis failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRecommendations = async () => {
        setLoading(true);

        try {
            const response =
                await getDeveloperRecommendations(6);

            setRecommendations(
                response.recommendations || []
            );
            toast.success("Recommendations updated.");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Could not load recommendations."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAlgorithmDemo = async () => {
        try {
            const response =
                await runAlgorithmDemo({
                    numbers: [42, 7, 19, 3, 31, 12],
                    target: 19,
                    first: "developer",
                    second: "developer",
                    capacity: 10,
                    items: [
                        {
                            name: "DSA",
                            value: 10,
                            effort: 5
                        },
                        {
                            name: "React",
                            value: 7,
                            effort: 4
                        },
                        {
                            name: "Git",
                            value: 4,
                            effort: 2
                        }
                    ]
                });

            setAlgorithmResult(response);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Algorithm demo failed."
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-8">
                <p className="text-blue-400 font-semibold">
                    Python Intelligence
                </p>
                <h1 className="text-4xl font-bold mt-2">
                    DevConnect AI Lab
                </h1>
                <p className="text-slate-400 mt-3 max-w-3xl">
                    An explainable Python service powers resume analysis,
                    developer recommendations and classic DSA algorithms.
                    No black-box scoring is hidden behind the UI.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold">
                        Resume Analyzer
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Paste your resume text to get a role-specific ATS-style
                        skill score and a focused learning plan.
                    </p>

                    <form
                        onSubmit={handleAnalyze}
                        className="mt-6 space-y-4"
                    >
                        <select
                            value={targetRole}
                            onChange={(event) =>
                                setTargetRole(event.target.value)
                            }
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                        >
                            <option value="full stack developer">
                                Full Stack Developer
                            </option>
                            <option value="software engineer">
                                Software Engineer
                            </option>
                            <option value="backend developer">
                                Backend Developer
                            </option>
                        </select>

                        <textarea
                            value={resumeText}
                            onChange={(event) =>
                                setResumeText(event.target.value)
                            }
                            rows={12}
                            placeholder="Paste at least 80 characters of resume text..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none"
                        />

                        <button
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold"
                        >
                            {loading ? "Analyzing..." : "Analyze Resume"}
                        </button>
                    </form>

                    {analysis && (
                        <div className="mt-6 space-y-4">
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-bold">
                                    {analysis.score}
                                </span>
                                <span className="text-slate-400 mb-2">
                                    / 100 ATS skill score
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Matched skills
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {analysis.matchedSkills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-sm"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Recommended next skills
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {analysis.recommendedNextSkills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold">
                        Developer Recommendations
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Python ranks other developers using skill overlap
                        and a small skill-relationship graph.
                    </p>

                    <button
                        onClick={handleRecommendations}
                        disabled={loading}
                        className="mt-6 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold"
                    >
                        Find Developers
                    </button>

                    <div className="mt-6 space-y-3">
                        {recommendations.length === 0 ? (
                            <p className="text-slate-500">
                                No recommendations loaded yet.
                            </p>
                        ) : (
                            recommendations.map((item) => (
                                <div
                                    key={item.user._id}
                                    className="border border-slate-800 rounded-xl p-4"
                                >
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold">
                                                {item.user.name}
                                            </h3>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {item.matchedSkills.join(", ")}
                                            </p>
                                        </div>
                                        <span className="text-blue-400 font-bold">
                                            {item.score}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <h3 className="font-bold text-lg">
                            DSA Playground
                        </h3>
                        <p className="text-slate-400 text-sm mt-2">
                            Runs merge sort, binary search, LCS and 0/1
                            knapsack inside the Python service.
                        </p>

                        <button
                            onClick={handleAlgorithmDemo}
                            className="mt-4 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-semibold"
                        >
                            Run Algorithms
                        </button>

                        {algorithmResult && (
                            <pre className="mt-4 bg-slate-950 rounded-xl p-4 overflow-auto text-sm text-slate-300">
                                {JSON.stringify(
                                    algorithmResult,
                                    null,
                                    2
                                )}
                            </pre>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AILab;
