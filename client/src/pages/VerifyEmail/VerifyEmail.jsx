import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { verifyEmail, resendVerification } from "../../services/authService";

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || "");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await verifyEmail(email, code);
            setMessage(response.message || "Email verified successfully.");
            setTimeout(() => navigate("/login", { replace: true }), 900);
        } catch (err) {
            setError(err?.response?.data?.message || "Verification failed. Please check the code and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        setMessage("");
        try {
            const response = await resendVerification(email);
            setMessage(response.message || "A new code was sent.");
        } catch (err) {
            setError(err?.response?.data?.message || "Could not resend the verification code.");
        } finally {
            setResending(false);
        }
    };

    return (
        <Card>
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-400 mb-2">DEVCONNECT AI</p>
                <h1 className="text-3xl font-bold">Verify your email</h1>
                <p className="text-slate-400 mt-2 leading-6">We sent a 6-digit code to your email address. Enter it below to verify your account.</p>
            </div>
            {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
            {message && <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
            <form onSubmit={handleVerify} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Verification code</label>
                    <Input type="text" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" required />
                </div>
                <Button type="submit" className="w-full py-3" disabled={loading}>{loading ? "Verifying..." : "Verify Email"}</Button>
            </form>
            <button type="button" onClick={handleResend} disabled={resending || !email} className="w-full mt-4 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-4 py-3 font-semibold">
                {resending ? "Sending..." : "Resend Code"}
            </button>
            <p className="text-center text-sm text-slate-400 mt-6">Already verified? <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">Log in</Link></p>
        </Card>
    );
}

export default VerifyEmail;
