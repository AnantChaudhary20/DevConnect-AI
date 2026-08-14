import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    analyzeResume,
    analyzeResumePdf,
    getDeveloperRecommendations,
    getIntelligenceHealth,
    runAlgorithmDemo
} from "../../services/intelligenceService";

function AILab() {
    const [resumeText, setResumeText] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [targetRole, setTargetRole] = useState("full stack developer");
    const [analysis, setAnalysis] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [algorithmResult, setAlgorithmResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [health, setHealth] = useState(null);

    useEffect(() => {
        getIntelligenceHealth().then(setHealth).catch((error) => {
            setHealth({ success: false, python: { reachable: false, message: error?.response?.data?.message || "AI service is unreachable." } });
        });
    }, []);

    const handleAnalyze = async (event) => {
        event.preventDefault();
        if (resumeText.trim().length < 80) {
            toast.error("Paste at least 80 characters of resume text, or upload a PDF.");
            return;
        }
        setLoading(true);
        try {
            const response = await analyzeResume(resumeText, targetRole);
            setAnalysis(response.analysis);
            toast.success("Resume analyzed.");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Resume analysis failed.");
        } finally { setLoading(false); }
    };

    const handlePdfUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") { toast.error("Please select a PDF file."); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("PDF must be smaller than 5MB."); return; }
        setResumeFile(file);
        setLoading(true);
        try {
            const response = await analyzeResumePdf(file, targetRole);
            setAnalysis(response.analysis);
            setResumeText("PDF resume analyzed successfully.");
            toast.success("PDF resume analyzed.");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not analyze the PDF resume.");
        } finally { setLoading(false); }
    };

    const handleRecommendations = async () => {
        setLoading(true);
        try {
            const response = await getDeveloperRecommendations(6);
            setRecommendations(response.recommendations || []);
            toast.success("Recommendations updated.");
        } catch (error) { toast.error(error?.response?.data?.message || "Could not load recommendations."); }
        finally { setLoading(false); }
    };

    const handleAlgorithmDemo = async () => {
        setLoading(true);
        try {
            const response = await runAlgorithmDemo({
                numbers: [42, 7, 19, 3, 31, 12], target: 19, first: "developer", second: "developer", capacity: 10,
                items: [{ name: "DSA", value: 10, effort: 5 }, { name: "React", value: 7, effort: 4 }, { name: "Git", value: 4, effort: 2 }]
            });
            setAlgorithmResult(response);
            toast.success("Algorithms executed successfully.");
        } catch (error) { toast.error(error?.response?.data?.message || "Algorithm demo failed."); }
        finally { setLoading(false); }
    };

    const online = Boolean(health?.python?.reachable);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="mb-8">
                <p className="text-blue-400 font-semibold">Python Intelligence</p>
                <h1 className="text-3xl sm:text-4xl font-bold mt-2">DevConnect AI Lab</h1>
                <p className="text-slate-400 mt-3 max-w-3xl leading-7">Analyze your resume against developer roles, find matching developers, and run DSA demonstrations through the Python service.</p>
                <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${online ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
                    <strong>AI service:</strong> {online ? "Online" : "Offline or unavailable"}
                    {health?.python?.message ? ` — ${health.python.message}` : ""}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <h2 className="text-2xl font-bold">Resume Analyzer</h2>
                    <p className="text-slate-400 mt-2 leading-6">Paste resume text or upload a text-based PDF. The analyzer returns an explainable ATS-style skill score.</p>
                    <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
                        <select value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                            <option value="full stack developer">Full Stack Developer</option>
                            <option value="software engineer">Software Engineer</option>
                            <option value="backend developer">Backend Developer</option>
                        </select>
                        <label className="block rounded-xl border-2 border-dashed border-blue-500/50 bg-blue-500/5 px-5 py-6 text-center cursor-pointer hover:bg-blue-500/10 transition">
                            <span className="block text-lg font-semibold text-blue-200">Upload Resume PDF</span>
                            <span className="block text-sm text-slate-500 mt-1">PDF only, maximum 5MB</span>
                            <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="sr-only" />
                        </label>
                        {resumeFile && <p className="text-sm text-slate-400">Selected: <span className="text-slate-200">{resumeFile.name}</span></p>}
                        <textarea value={resumeText} onChange={(event) => setResumeText(event.target.value)} rows={12} placeholder="Paste at least 80 characters of resume text..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none" />
                        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold">{loading ? "Analyzing..." : "Analyze Resume Text"}</button>
                    </form>
                    {analysis && <div className="mt-6 space-y-5">
                        <div className="flex items-end gap-3"><span className="text-5xl font-bold">{analysis.score}</span><span className="text-slate-400 mb-2">/ 100 ATS skill score</span></div>
                        <div><p className="text-sm text-slate-400">Matched skills</p><div className="flex flex-wrap gap-2 mt-2">{(analysis.matchedSkills || []).map((skill) => <span key={skill} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-sm">{skill}</span>)}</div></div>
                        <div><p className="text-sm text-slate-400">Missing skills</p><div className="flex flex-wrap gap-2 mt-2">{(analysis.missingSkills || []).map((skill) => <span key={skill} className="px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20 text-sm">{skill}</span>)}</div></div>
                        <div><p className="text-sm text-slate-400">Recommended next skills</p><div className="flex flex-wrap gap-2 mt-2">{(analysis.recommendedNextSkills || []).map((skill) => <span key={skill} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm">{skill}</span>)}</div></div>
                    </div>}
                </section>

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <h2 className="text-2xl font-bold">Developer Recommendations</h2>
                    <p className="text-slate-400 mt-2 leading-6">Find developers with overlapping skills through the Python recommendation engine.</p>
                    <button type="button" onClick={handleRecommendations} disabled={loading} className="mt-6 w-full sm:w-auto bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold">Find Developers</button>
                    <div className="mt-6 space-y-3">{recommendations.length === 0 ? <p className="text-slate-500">No recommendations loaded yet.</p> : recommendations.map((item) => <div key={item.user._id} className="border border-slate-800 rounded-xl p-4"><div className="flex flex-col sm:flex-row sm:justify-between gap-3"><div><h3 className="font-bold">{item.user.name}</h3><p className="text-sm text-slate-400 mt-1">{(item.matchedSkills || []).join(", ")}</p></div><span className="text-blue-400 font-bold">{item.score}</span></div></div>)}</div>
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <h3 className="font-bold text-lg">DSA Playground</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-6">Run merge sort, binary search, LCS and 0/1 knapsack inside the Python service.</p>
                        <button type="button" onClick={handleAlgorithmDemo} disabled={loading} className="mt-4 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold">Run Algorithms</button>
                        {algorithmResult && <pre className="mt-4 bg-slate-950 rounded-xl p-4 overflow-auto text-xs sm:text-sm text-slate-300">{JSON.stringify(algorithmResult, null, 2)}</pre>}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AILab;
