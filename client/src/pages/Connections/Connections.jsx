import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function Connections() {
    const { userId } = useParams();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [activeTab, setActiveTab] = useState("followers");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadConnections = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get(`/users/connections/${userId}`);
                setFollowers(response.data.followers || []);
                setFollowing(response.data.following || []);
            } catch (requestError) {
                setError(
                    requestError?.response?.data?.message ||
                    "Failed to load connections."
                );
            } finally {
                setLoading(false);
            }
        };

        loadConnections();
    }, [userId]);

    const users = useMemo(
        () => (activeTab === "followers" ? followers : following),
        [activeTab, followers, following]
    );

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7 shadow-2xl shadow-black/10">
                <div>
                    <span className="text-sm font-semibold text-blue-400">Your network</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Connections</h1>
                    <p className="text-slate-400 mt-2">See exactly who follows this developer and who they follow.</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-7 rounded-2xl bg-slate-950/70 p-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("followers")}
                        className={`rounded-xl px-4 py-3 text-sm sm:text-base font-semibold transition ${activeTab === "followers" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                    >
                        Followers <span className="ml-1 opacity-70">{followers.length}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("following")}
                        className={`rounded-xl px-4 py-3 text-sm sm:text-base font-semibold transition ${activeTab === "following" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                    >
                        Following <span className="ml-1 opacity-70">{following.length}</span>
                    </button>
                </div>

                {loading ? (
                    <div className="py-14 text-center text-slate-400">Loading connections…</div>
                ) : error ? (
                    <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">{error}</div>
                ) : users.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-10 text-center">
                        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">◎</div>
                        <h2 className="mt-4 text-xl font-bold">No {activeTab} yet</h2>
                        <p className="mt-2 text-slate-500 text-sm">This list will populate as developers connect.</p>
                    </div>
                ) : (
                    <div className="mt-6 space-y-3">
                        {users.map((user) => (
                            <div key={user._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:border-blue-500/25 transition">
                                <div className="flex items-center gap-4 min-w-0">
                                    <img src={user.profilePicture || "https://via.placeholder.com/80?text=User"} alt={user.name} className="h-14 w-14 shrink-0 rounded-full object-cover object-center border border-slate-700" />
                                    <div className="min-w-0">
                                        <h3 className="font-bold truncate">{user.name}</h3>
                                        <p className="text-sm text-slate-500 mt-1">Developer</p>
                                    </div>
                                </div>
                                <Link to={`/user/${user._id}`} className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 font-semibold transition">
                                    View Profile
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Connections;
