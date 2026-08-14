import api from "./api";

export const loginUser = async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
};

export const signupUser = async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
};

export const verifyEmail = async (email, code) => {
    const response = await api.post("/auth/verify-email", { email, code });
    return response.data;
};

export const resendVerification = async (email) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
};
