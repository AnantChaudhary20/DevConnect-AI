import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import { logout } from "../../redux/slices/authSlice";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        setOpen(false);
        navigate("/login");
    };

    const closeMenu = () => setOpen(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/" onClick={closeMenu} className="shrink-0"><Logo /></Link>

                    <div className="hidden md:flex items-center gap-7 text-slate-300">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <Link to="/feed" className="hover:text-white transition">Feed</Link>
                        {isAuthenticated && <>
                            <Link to="/bookmarks" className="hover:text-white transition">Bookmarks</Link>
                            <Link to="/ai-lab" className="hover:text-white transition">AI Lab</Link>
                            <Link to="/profile" className="hover:text-white transition">Profile</Link>
                        </>}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? <>
                            <Link to="/profile" className="text-slate-300 hover:text-white max-w-32 truncate">{user?.name || "Developer"}</Link>
                            <Link to="/create-project"><Button>+ Project</Button></Link>
                            <Button onClick={handleLogout} className="bg-slate-800 hover:bg-red-600">Logout</Button>
                        </> : <>
                            <Link to="/login"><Button className="bg-slate-800 hover:bg-slate-700">Login</Button></Link>
                            <Link to="/signup"><Button>Sign Up</Button></Link>
                        </>}
                    </div>

                    <button type="button" aria-label="Toggle navigation menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200">
                        <span className="text-xl">{open ? "×" : "☰"}</span>
                    </button>
                </div>

                {open && <div className="md:hidden mt-4 border-t border-slate-800 pt-4 space-y-2">
                    <Link to="/" onClick={closeMenu} className="block rounded-lg px-4 py-3 hover:bg-slate-800">Home</Link>
                    <Link to="/feed" onClick={closeMenu} className="block rounded-lg px-4 py-3 hover:bg-slate-800">Feed</Link>
                    {isAuthenticated ? <>
                        <Link to="/bookmarks" onClick={closeMenu} className="block rounded-lg px-4 py-3 hover:bg-slate-800">Bookmarks</Link>
                        <Link to="/ai-lab" onClick={closeMenu} className="block rounded-lg px-4 py-3 hover:bg-slate-800">AI Lab</Link>
                        <Link to="/profile" onClick={closeMenu} className="block rounded-lg px-4 py-3 hover:bg-slate-800">Profile</Link>
                        <Link to="/create-project" onClick={closeMenu} className="block rounded-lg px-4 py-3 bg-blue-600 text-center font-semibold">Create Project</Link>
                        <button type="button" onClick={handleLogout} className="w-full rounded-lg px-4 py-3 bg-slate-800 hover:bg-red-600 text-left font-semibold">Logout</button>
                    </> : <>
                        <Link to="/login" onClick={closeMenu} className="block rounded-lg px-4 py-3 bg-slate-800 text-center">Login</Link>
                        <Link to="/signup" onClick={closeMenu} className="block rounded-lg px-4 py-3 bg-blue-600 text-center font-semibold">Sign Up</Link>
                    </>}
                </div>}
            </div>
        </nav>
    );
}

export default Navbar;
