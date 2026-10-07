import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthShell, { API_URL, LockIcon, EyeIcon } from './AuthShell';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const er = {};
        if (password.length < 6) er.password = 'Use at least 6 characters.';
        if (confirm !== password) er.confirm = 'Passwords do not match.';
        setErrors(er);
        if (Object.keys(er).length) return;

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password }, { timeout: 70000 });
            setSuccess((res.data?.message || 'Password updated.') + ' Taking you to login...');
            setTimeout(() => navigate('/login'), 1500);
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

    const eye = (
        <button type="button" className="as-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
            <EyeIcon off={show} />
        </button>
    );

    return (
        <AuthShell title="Set a New Password" subtitle="Choose a new password for your Lab Portal account.">
            <form onSubmit={handleSubmit} noValidate>
                {error && (
                    <div role="alert" className="as-alert">
                        {error}{' '}
                        <Link to="/forgot-password" className="as-link">Request a new link</Link>
                    </div>
                )}
                {success && <div role="status" className="as-success">{success}</div>}

                <label className="as-label" htmlFor="password">New Password</label>
                <div className="as-field">
                    <span className="as-icon"><LockIcon /></span>
                    <input
                        id="password" type={show ? 'text' : 'password'} value={password} autoComplete="new-password"
                        onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                        placeholder="At least 6 characters" style={{ paddingRight: 46 }}
                        className={`as-input${errors.password ? ' as-invalid' : ''}`}
                    />
                    {eye}
                </div>
                {errors.password && <div className="as-error">{errors.password}</div>}

                <label className="as-label" htmlFor="confirm">Confirm New Password</label>
                <div className="as-field">
                    <span className="as-icon"><LockIcon /></span>
                    <input
                        id="confirm" type={show ? 'text' : 'password'} value={confirm} autoComplete="new-password"
                        onChange={(e) => { setConfirm(e.target.value); setErrors({ ...errors, confirm: '' }); }}
                        placeholder="Re-enter password"
                        className={`as-input${errors.confirm ? ' as-invalid' : ''}`}
                    />
                </div>
                {errors.confirm && <div className="as-error">{errors.confirm}</div>}

                <button type="submit" className="as-btn" disabled={loading || !!success}>
                    {loading && <span className="as-spinner" />}
                    {loading ? 'Saving...' : 'Update Password'}
                </button>
            </form>

            <div className="as-foot">
                <Link to="/login" className="as-link">Back to login</Link>
            </div>
        </AuthShell>
    );
};

export default ResetPassword;
