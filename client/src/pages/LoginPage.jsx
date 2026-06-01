import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './LoginPage.css';

function LoginPage({ setUser }) {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'student';
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        stream: 'Science',
        password: '',
        confirmPassword: '',
        otp: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Redirect if already logged in
    useEffect(() => {
        try {
            const user = sessionStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                if (userData.role === 'teacher') {
                    navigate('/teacher-dashboard', { replace: true });
                } else {
                    navigate('/student-dashboard', { replace: true });
                }
            }
        } catch {
            // Invalid session data, ignore
        }
    }, [navigate]);

    // Reset form state when role changes
    useEffect(() => {
        setIsRegister(false);
        setError('');
        setFormData({
            id: '',
            name: '',
            email: '',
            stream: 'Science',
            password: '',
            confirmPassword: '',
            otp: ''
        });
        setOtpSent(false);
        setSuccessMessage('');
    }, [role]);

    const handleSendOtp = async () => {
        if (!formData.email) {
            setError('Please enter your email first');
            return;
        }
        setOtpLoading(true);
        setError('');
        try {
            await axiosInstance.post(`/otp/send-otp`, { email: formData.email });
            setOtpSent(true);
            setSuccessMessage('OTP sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (isRegister && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            let response;

            if (isRegister) {
                response = await axiosInstance.post(`/students/register`, {
                    id: formData.id,
                    name: formData.name,
                    email: formData.email,
                    stream: formData.stream,
                    password: formData.password,
                    otp: formData.otp
                });
            } else {
                if (role === 'teacher') {
                    response = await axiosInstance.post(`/faculty/login`, {
                        username: formData.id,
                        password: formData.password
                    });
                } else {
                    response = await axiosInstance.post(`/students/login`, {
                        id: formData.id,
                        password: formData.password
                    });
                }
            }

            const userData = {
                ...response.data.student || response.data.faculty,
                role: response.data.role
            };

            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));

            // Clear form after success
            setFormData({
                id: '',
                name: '',
                email: '',
                stream: 'Science',
                password: '',
                confirmPassword: '',
                otp: ''
            });
            setOtpSent(false);
            setSuccessMessage('');
            setError('');

            // Small delay for smooth transition
            setTimeout(() => {
                if (role === 'teacher') {
                    navigate('/teacher-dashboard', { replace: true });
                } else {
                    navigate('/student-dashboard', { replace: true });
                }
            }, 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="card login-card">
                    <div className="login-header">
                        <h2>{isRegister ? 'Student Registration' : (role === 'teacher' ? 'Faculty Portal' : 'Student Portal')}</h2>
                        <p>{isRegister ? 'Create your student account' : 'Access your academic dashboard'}</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">FULL NAME</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">EMAIL ADDRESS</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="example@college.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        maxLength={254}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stream">STREAM</label>
                                    <select
                                        id="stream"
                                        name="stream"
                                        value={formData.stream}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="Science">Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="id">{isRegister ? 'ROLL NO / STUDENT ID' : (role === 'teacher' ? 'USERNAME' : 'USER ID / ROLL NO')}</label>
                            <input
                                id="id"
                                type="text"
                                name="id"
                                placeholder={role === 'teacher' ? 'e.g. admin' : 'e.g. S101'}
                                value={formData.id}
                                onChange={handleChange}
                                required
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">PASSWORD</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                maxLength={128}
                            />
                        </div>

                        {isRegister && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    maxLength={128}
                                />
                            </div>
                        )}

                        {isRegister && (
                            <div className="form-group">
                                <label htmlFor="otp">EMAIL VERIFICATION (OTP)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        id="otp"
                                        type="text"
                                        name="otp"
                                        placeholder="Enter 6-digit OTP"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required={otpSent}
                                        disabled={!otpSent}
                                        style={{ flex: 1 }}
                                        maxLength={6}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-outline" 
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || !formData.email}
                                        style={{ whiteSpace: 'nowrap', padding: '0 15px' }}
                                    >
                                        {otpLoading ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
                                    </button>
                                </div>
                                {successMessage && <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '5px' }}>{successMessage}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading ? (isRegister ? 'Creating Account...' : 'Authorizing...') : (isRegister ? 'Register' : 'Authorize Login')}
                        </button>
                    </form>

                    <div className="login-footer">
                        {role === 'student' && (
                            <p style={{ marginBottom: '10px' }}>
                                {isRegister ? (
                                    <>Already have an account? <Link to="#" onClick={(e) => { e.preventDefault(); setIsRegister(false); }}>Login Here</Link></>
                                ) : (
                                    <>New student? <Link to="#" onClick={(e) => { e.preventDefault(); setIsRegister(true); }}>Register Now</Link></>
                                )}
                            </p>
                        )}
                        <p>
                            {role === 'teacher' ? (
                                <>Not a faculty member? <Link to="/login?role=student">Student Login</Link></>
                            ) : (
                                !isRegister && <>Faculty member? <Link to="/login?role=teacher">Faculty Login</Link></>
                            )}
                        </p>
                    </div>

                    <div className="login-actions" style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-home"></i>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
