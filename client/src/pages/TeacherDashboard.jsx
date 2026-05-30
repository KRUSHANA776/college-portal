import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './TeacherDashboard.css';

function TeacherDashboard({ user }) {
    const [students, setStudents] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination and Search state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        stream: 'Science',
        standard: '12th',
        attendance: 0,
        marks: [],
        password: ''
    });
    const [noticeData, setNoticeData] = useState({
        title: '',
        content: '',
        category: 'Academic'
    });
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        otp: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [toast, setToast] = useState('');
    const [changePassword, setChangePassword] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchData();
    }, [page, debouncedSearch]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentsRes, noticesRes] = await Promise.all([
                axiosInstance.get(`/students?page=${page}&limit=10&search=${debouncedSearch}`),
                axiosInstance.get(`/notices`)
            ]);
            setStudents(studentsRes.data.data);
            setTotalPages(studentsRes.data.pages);
            setNotices(noticesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Error loading data');
            setLoading(false);
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddStudent = () => {
        setEditingStudent(null);
        setFormData({
            id: '',
            name: '',
            email: '',
            stream: 'Science',
            standard: '12th',
            attendance: 0,
            marks: [],
            password: ''
        });
        setChangePassword(false);
        setShowModal(true);
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setFormData({
            id: student.id,
            name: student.name,
            email: student.email || '',
            stream: student.stream,
            standard: student.standard || '12th',
            attendance: student.attendance,
            marks: Array.isArray(student.marks) ? student.marks : [],
            password: '' // Keep empty by default when editing
        });
        setChangePassword(false);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingStudent) {
                // Update existing student
                const payload = { ...formData };
                if (!changePassword) {
                    delete payload.password;
                }
                await axiosInstance.put(`/students/${formData.id}`, payload);
                showToast('Student updated successfully');
            } else {
                // Create new student
                await axiosInstance.post(`/students`, formData);
                showToast('Student created successfully');
            }

            setShowModal(false);
            fetchData();
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                sessionStorage.clear();
                window.location.href = '/login?role=teacher';
                return;
            }
            showToast(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleNoticeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/notices`, noticeData);
            showToast('Notice posted successfully');
            setShowNoticeModal(false);
            setNoticeData({ title: '', content: '', category: 'Academic' });
            fetchData();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Error posting notice');
        }
    };

    const handleDeleteNotice = async (id) => {
        if (window.confirm('Delete this notice?')) {
            try {
                await axiosInstance.delete(`/notices/${id}`);
                showToast('Notice deleted');
                fetchData();
            } catch (error) {
                console.error(error);
                showToast(error.response?.data?.message || 'Error deleting notice');
            }
        }
    };

    const handleSendFacultyOtp = async () => {
        if (!user.email) {
            showToast('Email not found in your profile. Please contact admin.');
            return;
        }
        setOtpLoading(true);
        try {
            await axiosInstance.post(`/otp/send-otp`, { email: user.email });
            setOtpSent(true);
            setSuccessMessage('OTP sent to your registered email!');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error 
                ? `${error.response.data.message}: ${error.response.data.error}`
                : (error.response?.data?.message || 'Error sending OTP');
            showToast(errorMsg);
        } finally {
            setOtpLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            showToast('New passwords do not match');
            return;
        }

        if (!passwordFormData.otp) {
            showToast('Please enter the OTP');
            return;
        }

        try {
            await axiosInstance.put(`/faculty/change-password`, {
                username: user.username,
                currentPassword: passwordFormData.currentPassword,
                newPassword: passwordFormData.newPassword,
                otp: passwordFormData.otp
            });
            showToast('Password changed successfully');
            setShowPasswordModal(false);
            setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
            setOtpSent(false);
            setSuccessMessage('');
        } catch (error) {
            console.error('Error changing password:', error);
            showToast(error.response?.data?.message || 'Error changing password');
        }
    };

    // Use the backend paginated students directly
    const filteredStudents = students;

    const handleAddMark = () => {
        setFormData({
            ...formData,
            marks: [...formData.marks, { subject: '', score: '' }]
        });
    };

    const handleMarkChange = (index, field, value) => {
        const newMarks = [...formData.marks];
        newMarks[index][field] = value;
        setFormData({ ...formData, marks: newMarks });
    };

    const handleRemoveMark = (index) => {
        const newMarks = formData.marks.filter((_, i) => i !== index);
        setFormData({ ...formData, marks: newMarks });
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axiosInstance.delete(`/students/${id}`);
                showToast('Student deleted successfully');
                fetchData();
            } catch (error) {
                console.error(error);
                showToast(error.response?.data?.message || 'Error deleting student');
            }
        }
    };

    const handlePublishResults = async (student) => {
        const newState = !student.resultsPublished;
        try {
            await axiosInstance.patch(`/students/publish-results/${student.id}`, { published: newState });
            showToast(`Results ${newState ? 'published' : 'unpublished'} for ${student.name}`);
            fetchData();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Error updating publish status');
        }
    };

    const handlePublishAll = async (published) => {
        const action = published ? 'publish' : 'unpublish';
        if (window.confirm(`Are you sure you want to ${action} results for ALL students?`)) {
            try {
                await axiosInstance.patch(`/students/publish-all-results`, { published });
                showToast(`All results ${action}ed successfully`);
                fetchData();
            } catch (error) {
                console.error(error);
                showToast(error.response?.data?.message || `Error ${action}ing all results`);
            }
        }
    };

    const getAttendanceBadge = (attendance) => {
        if (attendance >= 85) return 'badge-success';
        if (attendance >= 75) return 'badge-warning';
        return 'badge-danger';
    };

    if (loading) {
        return (
            <div className="teacher-dashboard">
                <div className="container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Faculty Management</h1>
                        <p>Master Data Administration</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/" className="btn btn-outline">
                            <i className="fas fa-home"></i>
                            Go to Website
                        </Link>
                        <button className="btn btn-outline" onClick={() => setShowNoticeModal(true)}>
                            <i className="fas fa-bullhorn"></i>
                            Post Notice
                        </button>
                        <button className="btn btn-primary" onClick={handleAddStudent}>
                            <i className="fas fa-plus"></i>
                            Add New Student
                        </button>
                        <button className="btn btn-outline" onClick={() => setShowPasswordModal(true)}>
                            <i className="fas fa-key"></i>
                            Change Password
                        </button>
                    </div>
                </div>

                <div className="card filter-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="search-bar" style={{ margin: 0, flex: '1', minWidth: '250px' }}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search students by name, roll no, or stream..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="bulk-actions" style={{ display: 'flex', gap: '10px' }}>
                         <button className="btn btn-success" onClick={() => handlePublishAll(true)}>
                             <i className="fas fa-check-double"></i> Publish All
                         </button>
                         <button className="btn btn-danger" onClick={() => handlePublishAll(false)}>
                             <i className="fas fa-eye-slash"></i> Unpublish All
                         </button>
                    </div>
                </div>

                <div className="card table-card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Standard</th>
                                    <th>Stream</th>
                                    <th>Attendance</th>
                                    <th>Results</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td><strong>{student.id}</strong></td>
                                        <td>{student.name}</td>
                                        <td>{student.standard || '12th'}</td>
                                        <td>{student.stream}</td>
                                        <td>
                                            <span className={`badge ${getAttendanceBadge(student.attendance)}`}>
                                                {student.attendance}%
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${student.resultsPublished ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => handlePublishResults(student)}
                                                title={student.resultsPublished ? 'Click to unpublish results' : 'Click to publish results to student'}
                                            >
                                                <i className={`fas ${student.resultsPublished ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                {student.resultsPublished ? ' Unpublish' : ' Publish'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => handleEditStudent(student)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline btn-sm btn-delete"
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem' }}>
                        <button 
                            className="btn btn-outline" 
                            disabled={page === 1} 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </button>
                        <span style={{ alignSelf: 'center' }}>Page {page} of {totalPages || 1}</span>
                        <button 
                            className="btn btn-outline" 
                            disabled={page === totalPages || totalPages === 0} 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Notices Management */}
                <div className="card table-card" style={{ marginTop: '2rem' }}>
                    <div className="card-header">
                        <h3>Active Notices</h3>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Title</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.map(notice => (
                                    <tr key={notice._id}>
                                        <td>{new Date(notice.date).toLocaleDateString()}</td>
                                        <td><span className="badge badge-info">{notice.category}</span></td>
                                        <td>{notice.title}</td>
                                        <td>
                                            <button className="btn btn-outline btn-sm btn-delete" onClick={() => handleDeleteNotice(notice._id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Roll Number</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    disabled={editingStudent}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Stream</label>
                                <select
                                    name="stream"
                                    value={formData.stream}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Standard/Class</label>
                                <input
                                    type="text"
                                    name="standard"
                                    value={formData.standard}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 12th"
                                    required
                                />
                            </div>

                            {editingStudent ? (
                                <div className="form-group checkbox-group" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="changePasswordCheckbox"
                                        checked={changePassword}
                                        onChange={(e) => {
                                            setChangePassword(e.target.checked);
                                            if (!e.target.checked) {
                                                setFormData(prev => ({ ...prev, password: '' }));
                                            }
                                        }}
                                        style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                                    />
                                    <label htmlFor="changePasswordCheckbox" style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal' }}>
                                        Change Student Password
                                    </label>
                                </div>
                            ) : null}

                            {(!editingStudent || changePassword) && (
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder={editingStudent ? "Enter new password" : "Enter student password"}
                                        required={!editingStudent || changePassword}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Attendance (%)</label>
                                <input
                                    type="number"
                                    name="attendance"
                                    min="0"
                                    max="100"
                                    value={formData.attendance}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Subjects & Marks
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddMark} style={{ fontSize: '0.7rem' }}>
                                        + Add Subject
                                    </button>
                                </label>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {formData.marks.map((mark, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Subject"
                                                value={mark.subject}
                                                onChange={(e) => handleMarkChange(index, 'subject', e.target.value)}
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Score"
                                                value={mark.score}
                                                onChange={(e) => handleMarkChange(index, 'score', e.target.value)}
                                                required
                                                min="0"
                                                max="100"
                                                style={{ width: '80px' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveMark(index)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {formData.marks.length === 0 && (
                                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>
                                            No marks added yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingStudent ? 'Update Student' : 'Create Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }

            {/* Notice Modal */}
            {
                showNoticeModal && (
                    <div className="modal-overlay" onClick={() => setShowNoticeModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Post New Notice</h2>
                                <button className="modal-close" onClick={() => setShowNoticeModal(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <form onSubmit={handleNoticeSubmit}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={noticeData.title}
                                        onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={noticeData.category}
                                        onChange={(e) => setNoticeData({ ...noticeData, category: e.target.value })}
                                    >
                                        <option value="Academic">Academic</option>
                                        <option value="Event">Event</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Holiday">Holiday</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Content</label>
                                    <textarea
                                        value={noticeData.content}
                                        onChange={(e) => setNoticeData({ ...noticeData, content: e.target.value })}
                                        required
                                        rows="4"
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }}
                                    ></textarea>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowNoticeModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Post Notice
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }


            {/* Password Modal */}
            {
                showPasswordModal && (
                    <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Change Faculty Password</h2>
                                <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <form onSubmit={handlePasswordChange}>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordFormData.currentPassword}
                                        onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                                        required
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordFormData.newPassword}
                                        onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                                        required
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordFormData.confirmPassword}
                                        onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                                        required
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Verification (OTP)</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={passwordFormData.otp}
                                            onChange={(e) => setPasswordFormData({ ...passwordFormData, otp: e.target.value })}
                                            required={otpSent}
                                            disabled={!otpSent}
                                            style={{ flex: 1 }}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline" 
                                            onClick={handleSendFacultyOtp}
                                            disabled={otpLoading}
                                            style={{ whiteSpace: 'nowrap', padding: '0 15px' }}
                                        >
                                            {otpLoading ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
                                        </button>
                                    </div>
                                    {successMessage && <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '5px' }}>{successMessage}</p>}
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowPasswordModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}

export default TeacherDashboard;
