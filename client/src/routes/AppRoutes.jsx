import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import MainLayout
    from "../layouts/MainLayout";

import AuthLayout
    from "../layouts/AuthLayout";

import ProtectedRoute
    from "./ProtectedRoute";
import Connections from "../pages/Connections/Connections";

import Landing
    from "../pages/Landing/Landing";

import Login
    from "../pages/Login/Login";

import Signup
    from "../pages/Signup/Signup";

import VerifyEmail
    from "../pages/VerifyEmail/VerifyEmail";

import Feed
    from "../pages/Feed/Feed";

import Profile
    from "../pages/Profile/Profile";

import UserProfile
    from "../pages/UserProfile/UserProfile";

import EditProfile
    from "../pages/EditProfile/EditProfile";

import CreateProject
    from "../pages/CreateProject/CreateProject";

import EditProject
    from "../pages/EditProject/EditProject";

import ProjectDetails
    from "../pages/ProjectDetails/ProjectDetails";

import Bookmarks
    from "../pages/Bookmarks/Bookmarks";

import NotFound
    from "../pages/NotFound/NotFound";

import AILab
    from "../pages/AILab/AILab";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


                <Route
                    element={<AuthLayout />}
                >

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    <Route
                        path="/verify-email"
                        element={<VerifyEmail />}
                    />

                </Route>


                <Route
                    element={<MainLayout />}
                >


                    <Route
                        path="/"
                        element={<Landing />}
                    />


                    <Route
                        path="/feed"
                        element={

                            <ProtectedRoute>

                                <Feed />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/profile"
                        element={

                            <ProtectedRoute>

                                <Profile />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/user/:userId"
                        element={

                            <ProtectedRoute>

                                <UserProfile />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/edit-profile"
                        element={

                            <ProtectedRoute>

                                <EditProfile />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/create-project"
                        element={

                            <ProtectedRoute>

                                <CreateProject />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/edit-project/:id"
                        element={

                            <ProtectedRoute>

                                <EditProject />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/ai-lab"
                        element={

                            <ProtectedRoute>

                                <AILab />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/bookmarks"
                        element={

                            <ProtectedRoute>

                                <Bookmarks />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/project/:id"
                        element={

                            <ProtectedRoute>

                                <ProjectDetails />

                            </ProtectedRoute>

                        }
                    />

                </Route>
                    <Route
    path="/connections/:userId"
    element={
        <ProtectedRoute>
            <Connections />
        </ProtectedRoute>
    }
/>

                <Route
                    path="*"
                    element={<NotFound />}
                />


            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;