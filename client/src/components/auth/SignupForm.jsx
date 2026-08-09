import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { signupUser } from "../../services/authService";

function SignupForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        mode: "onBlur"
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        setServerError("");

        try {
            await signupUser({
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password
            });

            navigate("/login", {
                replace: true,
                state: {
                    signupSuccess:
                        "Account created successfully. Please log in."
                }
            });
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            if (Array.isArray(validationErrors) && validationErrors.length) {
                setServerError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(" ")
                );
            } else {
                setServerError(
                    error.response?.data?.message ||
                    "We could not create your account. Please try again."
                );
            }
        }
    };

    return (
        <Card>
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-400 mb-2">
                    DEVCONNECT AI
                </p>

                <h1 className="text-3xl font-bold">
                    Create your account
                </h1>

                <p className="text-slate-400 mt-2">
                    Join developers, share projects, and grow your network.
                </p>
            </div>

            {serverError && (
                <div
                    role="alert"
                    className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {serverError}
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
            >
                <div>
                    <label
                        htmlFor="signup-name"
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        Full name
                    </label>

                    <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        {...register("name", {
                            required: "Name is required.",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters."
                            },
                            maxLength: {
                                value: 60,
                                message: "Name must be 60 characters or less."
                            }
                        })}
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="signup-email"
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        Email
                    </label>

                    <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address."
                            }
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
                        htmlFor="signup-password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        Password
                    </label>

                    <Input
                        id="signup-password"
                        type="password"
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters."
                            }
                        })}
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="signup-confirm-password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        Confirm password
                    </label>

                    <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Enter your password again"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        {...register("confirmPassword", {
                            required: "Please confirm your password.",
                            validate: (value) =>
                                value === password ||
                                "Passwords do not match."
                        })}
                    />

                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-blue-400 hover:text-blue-300"
                >
                    Log in
                </Link>
            </p>
        </Card>
    );
}

export default SignupForm;
