import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './StudentDashboard.css';

function StudentDashboard({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBonafide, setShowBonafide] = useState(false);

    const [showReportCard, setShowReportCard] = useState(false);
    const [showAttendanceCert, setShowAttendanceCert] = useState(false);


    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser]);

    useEffect(() => {
        const fetchData = async () => {
            if (!initialUser?.id) return;
            try {
                const [userRes, noticesRes] = await Promise.all([
                    axiosInstance.get(`/students/${initialUser.id}`),
                    axiosInstance.get(`/notices`)
                ]);
                setUser(prev => ({ ...prev, ...userRes.data, role: 'student' }));
                setNotices(noticesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialUser?.id]);

    const handlePrintBonafide = () => {
        setShowBonafide(true);
        setTimeout(() => {
            window.print();
            setShowBonafide(false);
        }, 100);
    };

    const handlePrintReportCard = () => {
        setShowReportCard(true);
        setTimeout(() => {
            window.print();
            setShowReportCard(false);
        }, 100);
    };

    const handlePrintAttendanceCert = () => {
        setShowAttendanceCert(true);
        setTimeout(() => {
            window.print();
            setShowAttendanceCert(false);
        }, 100);
    };


    const getAttendanceBadge = (attendance) => {
        if (attendance >= 85) return 'badge-success';
        if (attendance >= 75) return 'badge-warning';
        return 'badge-danger';
    };

    const getNoticeBadge = (category) => {
        switch (category) {
            case 'Urgent': return 'badge-danger';
            case 'Holiday': return 'badge-warning';
            case 'Event': return 'badge-success';
            default: return 'badge-info';
        }
    };

    // Calculate Marks logic
    const marksArray = Array.isArray(user.marks) ? user.marks : [];
    const totalMarks = marksArray.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
    const maxMarks = marksArray.length * 100;
    const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

    if (loading) {
        return (
            <div className="student-dashboard">
                <div className="container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            <div className="container">
                {/* Welcome Card */}
                <div className="card welcome-card">
                    <h1>Welcome, {user?.name || initialUser?.name || 'Student'}</h1>
                    <p>Prof. BSS Jr College | Batch {user.batch || '2025-26'}</p>
                    <div className="student-info">
                        <span><strong>Roll No:</strong> {user.id}</span>
                        <span><strong>Standard:</strong> {user.standard || '12th'}</span>
                        <span><strong>Stream:</strong> {user.stream || 'Science'}</span>
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="dashboard-grid">
                    <div className="card stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <h3>Attendance</h3>
                        <div className="stat-value">
                            <span className={`badge ${getAttendanceBadge(user.attendance)}`}>
                                {user.attendance}%
                            </span>
                        </div>
                        <p className="stat-label">
                            {user.attendance >= 75 ? 'Good Standing' : 'Below Requirement'}
                        </p>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3>Aggregate Percentage</h3>
                        <div className="stat-value">
                            <span className="marks">{user.resultsPublished ? `${percentage}%` : '-'}</span>
                        </div>
                        <p className="stat-label">{user.resultsPublished ? `Total: ${totalMarks} / ${maxMarks}` : 'Results Pending'}</p>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <h3>Performance</h3>
                        <div className="stat-value">
                            {user.resultsPublished ? (
                                <span className={`badge ${percentage >= 75 ? 'badge-success' : percentage >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                                    {percentage >= 75 ? 'Excellent' : percentage >= 50 ? 'Good' : 'Needs Improvement'}
                                </span>
                            ) : (
                                <span className="badge badge-info">Pending</span>
                            )}
                        </div>
                        <p className="stat-label">Overall Rating</p>
                    </div>
                </div>

                {/* Subject Wise Marks Table */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header">
                        <h3><i className="fas fa-book"></i> Academic Performance</h3>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Marks Obtained</th>
                                    <th>Total Marks</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!user.resultsPublished ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                                            <i className="fas fa-lock" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#cbd5e1' }}></i>
                                            <br/>
                                            Results have not been published yet.
                                        </td>
                                    </tr>
                                ) : marksArray.length > 0 ? marksArray.map((mark, index) => (
                                    <tr key={index}>
                                        <td>{mark.subject}</td>
                                        <td><strong>{mark.score}</strong></td>
                                        <td>100</td>
                                        <td>
                                            <span className={`badge ${mark.score >= 75 ? 'badge-success' : mark.score >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                                                {mark.score >= 90 ? 'O' : mark.score >= 80 ? 'A+' : mark.score >= 70 ? 'A' : mark.score >= 60 ? 'B+' : mark.score >= 50 ? 'B' : mark.score >= 40 ? 'C' : mark.score >= 35 ? 'D' : 'F'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-light)' }}>No marks uploaded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-grid-2">
                    {/* Notice Board */}
                    <div className="card notice-card">
                        <div className="card-header">
                            <h3><i className="fas fa-bullhorn"></i> Notice Board</h3>
                            <span className="notice-count">{notices.length} New</span>
                        </div>
                        <div className="notice-list">
                            {notices.length > 0 ? notices.map(notice => (
                                <div key={notice._id} className="notice-item">
                                    <div className="notice-meta">
                                        <span className={`badge ${getNoticeBadge(notice.category)}`}>{notice.category}</span>
                                        <span className="notice-date">{new Date(notice.date).toLocaleDateString()}</span>
                                    </div>
                                    <h4>{notice.title}</h4>
                                    <p>{notice.content}</p>
                                </div>
                            )) : <p className="no-data">No notices at the moment.</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="card actions-card">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            <Link to="/" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
                                Back to Home
                            </Link>
                            <button className="btn btn-primary" onClick={handlePrintBonafide}>
                                <i className="fas fa-file-alt"></i>
                                Generate Bonafide
                            </button>
                            <button className="btn btn-outline" onClick={handlePrintAttendanceCert}>
                                <i className="fas fa-check-circle"></i>
                                Attendance Certificate
                            </button>
                            {user.resultsPublished && (
                                <button className="btn btn-outline" onClick={handlePrintReportCard}>
                                    <i className="fas fa-download"></i>
                                    Download Report Card
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Bonafide Certificate for Printing */}
            {showBonafide && (
                <div className="bonafide-print">
                    <div className="bonafide-header">
                        <img src="/logo.png" alt="College Logo" className="print-logo" />
                        <p>Gram Vikas Mandal's Molgi</p>
                        <h2>Late Prof.B.S.Saindane Art &amp; Sci Jr. College Molgi Tal, Akkalkuwa Dist. Nandurbar </h2>
                    </div>
                    <div className="bonafide-content">
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <h2>BONAFIDE CERTIFICATE</h2>
                        <p>
                            This is to certify Mr./Miss. <strong>{user.name}</strong>  studing in the class of <strong>{user.standard || '12th'} {user.stream} </strong> 
                            is a bonafide student of this college.His/Her date of birth according to the School-general Register is _________________________ 
                        </p>
                        <p>
                            He/She Bears a Good moral character to the best of our knowledge and belif.
                        </p>
                    </div>
                    <div className="bonafide-footer">
                        <p>_________________________</p>
                        <p><strong>Principal</strong></p>
                    </div>
                </div>
            )}

            {/* Report Card for Printing */}
            {showReportCard && (
                <div className="bonafide-print"> {/* Reusing print class for simplicity */}
                    <div className="bonafide-header">
                        <img src="/logo.png" alt="College Logo" className="print-logo" />
                        <p>Gram Vikas Mandal's Molgi</p>
                        <h2>Late Prof.B.S.Saindane Art &amp; Sci Jr. College Molgi Tal, Akkalkuwa Dist. Nandurbar </h2>
                        {user.batch || '2026-27'} 
                    </div> 
                    <div className="bonafide-content" style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>
                            <div>
                                <p><strong>Student Name:</strong> {user.name}</p>
                                <p><strong>Roll No:</strong> {user.id}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p><strong>Standard:</strong> {user.standard || '12th'}</p>
                                <p><strong>Stream:</strong> {user.stream}</p>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ background: '#eee' }}>
                                    <th style={{ border: '1px solid #000', padding: '10px' }}>Subject</th>
                                    <th style={{ border: '1px solid #000', padding: '10px' }}>Max Marks</th>
                                    <th style={{ border: '1px solid #000', padding: '10px' }}>Obtained</th>
                                    <th style={{ border: '1px solid #000', padding: '10px' }}>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marksArray.map((mark, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #000', padding: '10px' }}>{mark.subject}</td>
                                        <td style={{ border: '1px solid #000', padding: '10px' }}>100</td>
                                        <td style={{ border: '1px solid #000', padding: '10px' }}>{mark.score}</td>
                                        <td style={{ border: '1px solid #000', padding: '10px' }}>
                                            {mark.score >= 90 ? 'O' : mark.score >= 80 ? 'A+' : mark.score >= 70 ? 'A' : mark.score >= 60 ? 'B+' : mark.score >= 50 ? 'B' : mark.score >= 40 ? 'C' : mark.score >= 35 ? 'D' : 'F'}
                                        </td>
                                    </tr>
                                ))}
                                <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
                                    <td style={{ border: '1px solid #000', padding: '10px' }}>TOTAL</td>
                                    <td style={{ border: '1px solid #000', padding: '10px' }}>{maxMarks}</td>
                                    <td style={{ border: '1px solid #000', padding: '10px' }}>{totalMarks}</td>
                                    <td style={{ border: '1px solid #000', padding: '10px' }}>
                                        {percentage}% ({percentage >= 35 ? 'PASS' : 'FAIL'})
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bonafide-footer" style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', padding: '0 50px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <p>_________________________</p>
                            <p><strong>Class Teacher</strong></p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p>_________________________</p>
                            <p><strong>Principal</strong></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Certificate for Printing */}
            {showAttendanceCert && (
                <div className="bonafide-print">
                    <div className="bonafide-header">
                        <img src="/logo.png" alt="College Logo" className="print-logo" />
                        <p>Gram Vikas Mandal's Molgi</p>
                        <h2>Late Prof.B.S.Saindane Art &amp; Sci Jr. College Molgi Tal, Akkalkuwa Dist. Nandurbar </h2>
                    </div>
                    <div className="bonafide-content" style={{ textAlign: 'center' }}>
                        <p style={{ textAlign: 'right' }}>Date: {new Date().toLocaleDateString()}</p>
                        <h2 style={{ margin: '40px 0', fontSize: '2.2rem', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Certificate of Attendance
                        </h2>
                        <div style={{ margin: '40px 0', fontSize: '1.3rem', lineHeight: '2' }}>
                            <p>This is to certify that {user.name} Enrollment No:  {user.id} 
                                of <strong> {user.standard || '12th'} {user.stream}</strong> has maintained a record of
                                <strong > {user.attendance}%</strong> Attendance during the academic session <strong>{user.batch || '2025-26'}</strong>.</p>
                        </div>
                    </div>
                    <div className="bonafide-footer" style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <p>_________________________</p>
                            <p><strong>Class Teacher</strong></p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p>_________________________</p>
                            <p><strong>Principal</strong></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;
