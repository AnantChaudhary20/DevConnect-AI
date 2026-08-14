import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

function Landing() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="max-w-4xl">
                    <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                        Developer Social Platform
                    </span>

                    <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98]">
                        Build. Collaborate.
                        <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                            Grow.
                        </span>
                    </h1>

                    <p className="mt-8 text-lg sm:text-xl text-slate-400 max-w-2xl leading-8">
                        Showcase what you build, connect with developers, publish projects, and use practical AI tools to sharpen your next opportunity.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-10">
                        <Link to={isAuthenticated ? "/create-project" : "/signup"}>
                            <Button className="w-full sm:w-auto min-w-44 shadow-lg shadow-blue-600/20">
                                {isAuthenticated ? "Create a Project" : "Create Your Profile"}
                            </Button>
                        </Link>
                        <Link to="/feed">
                            <Button className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-700 border border-slate-700">
                                Explore Projects
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
                        {[
                            ["Project showcase", "Turn your work into a portfolio people can actually browse."],
                            ["Developer network", "Follow builders and discover people with useful skills."],
                            ["AI Lab", "Analyze resumes, find matches, and practice DSA concepts."],
                        ].map(([title, text]) => (
                            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
                                <h2 className="font-bold text-slate-100">{title}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Landing;
