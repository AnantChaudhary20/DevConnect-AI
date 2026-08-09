import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import Logo from "../ui/Logo";
import Button from "../ui/Button";

import {
    logout
} from "../../redux/slices/authSlice";


function Navbar() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        user,
        isAuthenticated
    } = useSelector(
        (state) => state.auth
    );


    const handleLogout = () => {

        localStorage.removeItem("token");

        dispatch(logout());

        navigate("/login");

    };


    return (

        <nav className="
            border-b
            border-slate-800
            bg-slate-950
        ">

            <div className="
                max-w-7xl
                mx-auto
                px-6
                py-4
                flex
                items-center
                justify-between
                gap-6
            ">

                <Link to="/">
                    <Logo />
                </Link>


                <div className="
                    hidden
                    md:flex
                    items-center
                    gap-8
                    text-slate-300
                ">

                    <Link
                        to="/"
                        className="hover:text-white"
                    >
                        Home
                    </Link>


                    <Link
                        to="/feed"
                        className="hover:text-white"
                    >
                        Feed
                    </Link>


                    <Link
                        to="/bookmarks"
                        className="hover:text-white"
                    >
                        Bookmarks
                    </Link>



                    {isAuthenticated && (

                        <Link
                            to="/ai-lab"
                            className="hover:text-white"
                        >
                            AI Lab
                        </Link>

                    )}


                    {isAuthenticated && (

                        <Link
                            to="/profile"
                            className="hover:text-white"
                        >
                            Profile
                        </Link>

                    )}

                </div>


                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    {isAuthenticated ? (

                        <>

                            <Link
                                to="/profile"
                                className="
                                    hidden
                                    sm:block
                                    text-slate-300
                                    hover:text-white
                                "
                            >

                                Hi,{" "}

                                {
                                    user?.name ||
                                    "Developer"
                                }

                            </Link>


                            <Button
                                onClick={handleLogout}
                                className="
                                    bg-red-600
                                    hover:bg-red-700
                                "
                            >

                                Logout

                            </Button>

                        </>

                    ) : (

                        <>

                            <Link to="/login">

                                <Button
                                    className="
                                        bg-slate-800
                                        hover:bg-slate-700
                                    "
                                >

                                    Login

                                </Button>

                            </Link>


                            <Link to="/signup">

                                <Button>

                                    Sign Up

                                </Button>

                            </Link>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}


export default Navbar;