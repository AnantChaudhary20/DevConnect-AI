import api from "./api";

const authHeaders = () => ({
    headers: {
        Authorization:
            `Bearer ${localStorage.getItem("token")}`
    }
});

export const analyzeResume = async (
    resumeText,
    targetRole
) => {
    const response =
        await api.post(
            "/intelligence/resume/analyze",
            {
                resumeText,
                targetRole
            },
            authHeaders()
        );

    return response.data;
};

export const getDeveloperRecommendations =
    async (limit = 5) => {
        const response =
            await api.get(
                "/intelligence/recommendations",
                {
                    ...authHeaders(),
                    params: { limit }
                }
            );

        return response.data;
    };

export const runAlgorithmDemo =
    async (payload) => {
        const response =
            await api.post(
                "/intelligence/algorithms/demo",
                payload,
                authHeaders()
            );

        return response.data;
    };
