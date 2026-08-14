const PYTHON_SERVICE_URL =
    process.env.PYTHON_SERVICE_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://devconnect-ai-api-gfud.onrender.com"
        : "http://127.0.0.1:8000");

const requestPython = async (path, payload = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(`${PYTHON_SERVICE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(
                data.message || `Python service request failed (${response.status})`
            );
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            const timeoutError = new Error("Python intelligence service timed out.");
            timeoutError.statusCode = 504;
            throw timeoutError;
        }

        if (
            error.code === "ECONNREFUSED" ||
            error.cause?.code === "ECONNREFUSED" ||
            error.code === "ENOTFOUND" ||
            error.cause?.code === "ENOTFOUND"
        ) {
            const offlineError = new Error(
                `Python intelligence service is unreachable at ${PYTHON_SERVICE_URL}.`
            );
            offlineError.statusCode = 503;
            throw offlineError;
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
};

const getPythonHealth = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
        const response = await fetch(`${PYTHON_SERVICE_URL}/health`, {
            signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        return {
            serviceUrl: PYTHON_SERVICE_URL,
            reachable: response.ok,
            ...data,
        };
    } catch (error) {
        return {
            serviceUrl: PYTHON_SERVICE_URL,
            reachable: false,
            status: "offline",
            message:
                error.name === "AbortError"
                    ? "Health check timed out."
                    : error.message,
        };
    } finally {
        clearTimeout(timeout);
    }
};

const analyzeResume = (resumeText, targetRole) =>
    requestPython("/analyze-resume", { resumeText, targetRole });

const getRecommendations = (skills, candidates, limit) =>
    requestPython("/recommend", { skills, candidates, limit });

const runAlgorithmDemo = (payload) =>
    requestPython("/algorithm-demo", payload);

module.exports = {
    analyzeResume,
    getRecommendations,
    runAlgorithmDemo,
    getPythonHealth,
};
