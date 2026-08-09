import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

function Landing() {
    return (
        <section className="min-h-[calc(100vh-80px)] flex items-center">

            <div className="max-w-7xl mx-auto px-6">

                <p className="text-blue-500 font-semibold mb-4">
                    Developer Social Platform
                </p>

                <h1 className="text-6xl font-extrabold leading-tight">

                    Build.

                    Collaborate.

                    <span className="text-blue-500">
                        {" "}Grow.
                    </span>

                </h1>

                <p className="mt-8 text-xl text-slate-400 max-w-2xl">

                    Showcase your projects, connect with developers,
                    and build a portfolio that stands out.

                </p>

                <div className="flex gap-4 mt-10">

                    <Link to="/signup">
                        <Button>
                            Get Started
                        </Button>
                    </Link>

                    <Link to="/feed">
                        <Button className="bg-slate-800 hover:bg-slate-700">
                            Explore Projects
                        </Button>
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default Landing;