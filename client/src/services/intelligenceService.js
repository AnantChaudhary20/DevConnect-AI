import api from "./api";

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getIntelligenceHealth = async () => {
    const response = await api.get("/intelligence/health");
    return response.data;
};

export const analyzeResumePdf = async (file, targetRole) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    const response = await api.post(
        "/intelligence/resume/analyze-pdf",
        formData,
        authHeaders()
    );

    return response.data;
};

export const getDeveloperRecommendations = async (limit = 6) => {
    const response = await api.get("/intelligence/recommendations", {
        ...authHeaders(),
        params: { limit },
    });

    return response.data;
};

export const runAlgorithmDemo = async (payload) => {
    const response = await api.post(
        "/intelligence/algorithms/demo",
        payload,
        authHeaders()
    );

    return response.data;
};
