import { Link } from "react-router-dom";

function Logo() {
    return (
        <Link
            to="/"
            className="text-3xl font-bold tracking-tight"
        >
            <span className="text-blue-500">Dev</span>
            <span className="text-white">Connect</span>
        </Link>
    );
}

export default Logo;