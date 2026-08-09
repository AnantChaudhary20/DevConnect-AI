const PYTHON_SERVICE_URL =
    process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

const requestPython = async (
    path,
    payload = {}
) => {
    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        10000
    );

    try {
        const response = await fetch(
            `${PYTHON_SERVICE_URL}${path}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        );

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(
                data.message || "Python service request failed"
            );
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            error.statusCode = 504;
            throw new Error("Python intelligence service timed out.");
        }

        if (
            error.code === "ECONNREFUSED" ||
            error.cause?.code === "ECONNREFUSED"
        ) {
            error.statusCode = 503;
            throw new Error(
                "Python intelligence service is offline. Start python-services/service.py first."
            );
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
};

const analyzeResume = (resumeText, targetRole) =>
    requestPython(
        "/analyze-resume",
        {
            resumeText,
            targetRole
        }
    );

const getRecommendations = (skills, candidates, limit) =>
    requestPython(
        "/recommend",
        {
            skills,
            candidates,
            limit
        }
    );

const runAlgorithmDemo = (payload) =>
    requestPython(
        "/algorithm-demo",
        payload
    );

module.exports = {
    analyzeResume,
    getRecommendations,
    runAlgorithmDemo
};
