import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { loginUser } from "../../services/authService";

import { useDispatch } from "react-redux";

import { loginSuccess } from "../../redux/slices/authSlice";

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        mode: "onBlur"
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [serverError, setServerError] = useState("");
    const [needsVerification, setNeedsVerification] = useState(false);
    const [successMessage, setSuccessMessage] = useState(
        location.state?.signupSuccess || ""
    );

    useEffect(() => {
        if (location.state?.signupSuccess) {
            navigate(location.pathname, {
                replace: true,
                state: {}
            });
        }
    }, [location.state, location.pathname, navigate]);

    const onSubmit = async (data) => {
        setServerError("");
        setSuccessMessage("");
        setNeedsVerification(false);

        try {
            const response = await loginUser(data);

            dispatch(
                loginSuccess({
                    user: response.user,
                    token: response.token
                })
            );

            navigate("/feed");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Login failed. Please check your email and password.";
            setServerError(message);
            setNeedsVerification(error.response?.status === 403);
        }
    };

    return (
        <Card>
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-400 mb-2">
                    DEVCONNECT AI
                </p>

                <h1 className="text-3xl font-bold">
                    Welcome back
                </h1>

                <p className="text-slate-400 mt-2">
                    Log in to continue building your developer network.
                </p>
            </div>

            {successMessage && (
                <div
                    role="status"
                    className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                    {successMessage}
                </div>
            )}

            {serverError && (
                <div
                    role="alert"
                    className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    <p>{serverError}</p>
                    {needsVerification && (
                        <Link
                            to="/verify-email"
                            className="inline-block mt-2 font-semibold text-blue-300 hover:text-blue-200"
                        >
                            Verify your email
                        </Link>
                    )}
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
            >
                <div>
                    <label
                        htmlFor="login-email"
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        Email
                    </label>

                    <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...register("email", {
                            required: "Email is required."
                        })}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="login-password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        Password
                    </label>

                    <Input
                        id="login-password"
                        type="password"
                        placeholder="Your password"
                        autoComplete="current-password"
                        {...register("password", {
                            required: "Password is required."
                        })}
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="font-semibold text-blue-400 hover:text-blue-300"
                >
                    Create one
                </Link>
            </p>
        </Card>
    );
}

export default LoginForm;
