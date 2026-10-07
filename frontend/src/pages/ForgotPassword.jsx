import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthShell, { API_URL, MailIcon } from './AuthShell';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setFieldError('Please enter the email you registered with.');
            return;
        }
        setFieldError('');

        try {
            setLoading(true);
            const res = await axios.post(
                `${API_URL}/api/auth/forgot-password`,
                { email: email.trim().toLowerCase() },
                { timeout: 70000 } // free server can take ~1 minute to wake up
            );
            setSuccess(res.data?.message || 'If an account exists for this email, a reset link has been sent.');
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || `Request failed (status ${err.response.status}).`);
            } else if (err.code === 'ECONNABORTED') {
                setError('The server is taking too long to respond. Please wait a moment and try again.');
            } else {
                setError('Cannot reach the server. Check your internet connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell title="Forgot Password?" subtitle="Enter your registered email and we will send you a link to set a new password.">
            <form onSubmit={handleSubmit} noValidate>
                {error && <div role="alert" className="as-alert">{error}</div>}
                {success && (
                    <div role="status" className="as-success">
                        {success}
                        <div style={{ fontWeight: 500, marginTop: 6, fontSize: 13 }}>
                            Check your inbox and spam folder. The link works for 15 minutes.
                        </div>
                    </div>
                )}

                <label className="as-label" htmlFor="email">Email ID</label>
                <div className="as-field">
                    <span className="as-icon"><MailIcon /></span>
                    <input
                        id="email" type="email" value={email} autoComplete="email"
                        onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                        placeholder="you@example.com"
                        className={`as-input${fieldError ? ' as-invalid' : ''}`}
                    />
                </div>
                {fieldError && <div className="as-error">{fieldError}</div>}

                <button type="submit" className="as-btn" disabled={loading}>
                    {loading && <span className="as-spinner" />}
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div className="as-foot">
                Remembered it? <Link to="/login" className="as-link">Back to login</Link>
            </div>
        </AuthShell>
    );
};

export default ForgotPassword;
