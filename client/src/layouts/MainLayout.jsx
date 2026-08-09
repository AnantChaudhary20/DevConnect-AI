import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default MainLayout;