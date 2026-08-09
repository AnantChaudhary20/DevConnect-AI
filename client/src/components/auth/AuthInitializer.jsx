import { useEffect } from "react";

import { useDispatch } from "react-redux";

import {
    setUser,
    logout,
    finishLoading
} from "../../redux/slices/authSlice";

import { getProfile } from "../../services/userService";

function AuthInitializer() {

    const dispatch = useDispatch();

    useEffect(() => {

        const initializeAuth = async () => {

            const token = localStorage.getItem("token");

            if (!token) {

                dispatch(finishLoading());

                return;

            }

            try {

                const response = await getProfile();

                dispatch(
                    setUser(response.user)
                );

            } catch (error) {

                console.error(
                    "Authentication restore failed:",
                    error
                );

                dispatch(logout());

            }

        };

        initializeAuth();

    }, [dispatch]);

    return null;

}

export default AuthInitializer;