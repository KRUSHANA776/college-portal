import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';

const BG_IMAGES = ['/a.jpeg', '/b.jpeg', '/c.jpeg', '/d.jpeg', '/e.jpeg', '/f.jpeg', '/g.jpeg'];

function LandingPage({ user }) {
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % BG_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goPrev = () => setCurrentBg(prev => (prev - 1 + BG_IMAGES.length) % BG_IMAGES.length);
    const goNext = () => setCurrentBg(prev => (prev + 1) % BG_IMAGES.length);

    return (
        <main className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                {/* Background slides */}
                {BG_IMAGES.map((img, i) => (
                    <div
                        key={i}
                        className={`hero-bg-slide ${i === currentBg ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}

                {/* Dark overlay + gradient */}
                <div className="hero-overlay" />

                <div className="hero-content">
                    <h1 className="hero-title">
                        Empowering The Leaders of Tomorrow  
                    </h1>
                    <div className="hero-actions">
                        <a href="#courses" className="btn btn-primary btn-large">
                            Explore Streams
                        </a>
                        {user ? (
                            <Link
                                to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'}
                                className="btn btn-outline btn-large"
                            >
                                Go to {user.role === 'student' ? 'Student' : 'Faculty'} Dashboard
                            </Link>
                        ) : (
                            <Link to="/login?role=student" className="btn btn-outline btn-large">
                                Student Portal
                            </Link>
                        )}
                    </div>
                </div>

                {/* Prev / Next arrows */}
                <button className="hero-arrow hero-arrow-prev" onClick={goPrev} aria-label="Previous">&#8249;</button>
                <button className="hero-arrow hero-arrow-next" onClick={goNext} aria-label="Next">&#8250;</button>

                {/* Dot indicators */}
                <div className="hero-dots">
                    {BG_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            className={`hero-dot ${i === currentBg ? 'active' : ''}`}
                            onClick={() => setCurrentBg(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="container section-about" id="about">
                <div className="section-header">
                    <h2>Why Prof. B.S.S. Art &amp; Sci Jr. College?</h2>
                    <p className="section-subtitle">
                        Founded in 1999, we provide a bridge between schooling and professional degrees.
                    </p>
                </div>
                <div className="grid-3">
                    <div className="feature-card">
                        <i className="fas fa-microscope"></i>
                        <h3>Modern Labs</h3>
                        <p>Fully equipped Physics, Chemistry, and Biology labs for HSC Board practicals.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-book-reader"></i>
                        <h3>Central Library</h3>
                        <p>Access to digital libraries and specialized modules for JEE, NEET, and CET.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-tree"></i>
                        <h3>Nature Friendly Campus</h3>
                        <p>Satpuda mountain range view, lush green gardens and serene environment </p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-award"></i>
                        <h3>Board Excellence</h3>
                        <p>Consistently maintaining a 99% pass rate in State Board exams.</p>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="section-courses" id="courses">
                <div className="container">
                    <div className="section-header">
                        <h2>Academic Streams</h2>
                        <p className="section-subtitle">
                            Specialized curriculum designed for 11th & 12th Standard students.
                        </p>
                    </div>
                    <div className="grid-3">
                        <div className="card course-card">
                            <h4 className="course-title">Science Stream</h4>
                            <ul className="course-list">
                                <li><i className="fas fa-check-circle"></i> Mathematics/Geography</li>
                                <li><i className="fas fa-check-circle"></i> Physics</li>
                                <li><i className="fas fa-check-circle"></i> Chemistry </li>
                                <li><i className="fas fa-check-circle"></i> Biology</li>
                                <li><i className="fas fa-check-circle"></i> English</li>
                                <li><i className="fas fa-check-circle"></i> Marathi/Hindi</li>
                            </ul>
                        </div> 
                        <div className="card course-card">
                            <h4 className="course-title">Arts Stream</h4>
                            <ul className="course-list">
                                <li><i className="fas fa-check-circle"></i>Marathi/Hindi</li>
                                <li><i className="fas fa-check-circle"></i>English</li>
                                <li><i className="fas fa-check-circle"></i> History</li>
                                <li><i className="fas fa-check-circle"></i> Geography</li>
                                <li><i className="fas fa-check-circle"></i> Economics</li>
                                <li><i className="fas fa-check-circle"></i> Defence studies</li>

                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Staff Section */}
            <section className="section-staff" id="staff">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Staff</h2>
                        <p className="section-subtitle">
                            Dedicated teachers and staff members.
                        </p>
                    </div>
                    <div className="grid-3">
                        <div className="card staff-card">
                            <h4 className="staff-title">H.M INCHARGE </h4>
                            <ul className="staff-list">
                                <li>Shri Vinod Dipachand Kuwar</li>
                                <li>Education: MA BED</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Asst. Teacher</h4>
                            <ul className="staff-list">
                                <li>Shri Bhoi Ravindra Ratilal</li>
                                <li>Education: MA BED</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Asst. Teacher</h4>
                            <ul className="staff-list">
                                <li>Shri Dhansing Khatrya Vasave</li>
                                <li>Education: MA BED</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Asst. Teacher</h4>
                            <ul className="staff-list">
                                <li>Shri Pravin Sukdev Chaudhari</li>
                                <li>Education: MSC BED.DSM</li> 
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Asst. Teacher</h4>
                            <ul className="staff-list">
                                <li>Shri Dinesh Ramlal Prajapati</li>
                                <li>Education: MA BED</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Asst. Teacher</h4>
                            <ul className="staff-list">
                                <li>Shri Manoj Rajaram Chaure</li>
                                <li>Education: MSC. BED</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Lab Assistant (Biology)</h4>
                            <ul className="staff-list">
                                <li>Shri Samadhan Dadabhau Mahajan</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Lab Assistant (Chemistry)</h4>
                            <ul className="staff-list">
                                <li>Shrimati Reena Bajirao Padvi</li>
                            </ul>
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Lab Assistant (Physics)</h4>
                            <ul className="staff-list">
                                <li>Shri Samadhan Dadabhau Mahajan &amp; Shrimati Reena Bajirao Padvi</li>
                            </ul> 
                        </div>
                        <div className="card staff-card">
                            <h4 className="staff-title">Lab Attendant</h4>
                            <ul className="staff-list">
                                <li>Shri Vijesing Narspatising Padvi</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="contact">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">
                            <h3>Prof. BSS Jr. College</h3>
                        </div>
                        <p className="footer-text">Inspiring minds, shaping futures since 1999.</p>
                    </div>
                    <div>
                        <h4>Contact Us</h4>
                        <p className="footer-text">📍 Molgi, Tal.Akkalkuwa, Dist.Nandurbar</p>
                        <p className="footer-text">📧 Email: <a href="mailto:[EMAIL_ADDRESS]" style={{ color: 'white' }}>lpbscolmolgi1999@gmail.com</a></p>
                        <p className="footer-text">📞 Phone: <a href="tel:+919404218036" style={{ color: 'white' }}>+91 9404218036</a> / <a href="tel:+919423501560" style={{ color: 'white' }}>+91 9423501560</a></p>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        {user ? (
                            <>
                                <Link to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} className="footer-link">Dashboard</Link>
                                <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login?role=teacher" className="footer-link">Admin Login</Link>
                                <Link to="/login?role=student" className="footer-link">Student Portal</Link>
                            </>
                        )}
                    </div>
                </div>
                <hr className="footer-hr" />
                <div className='cr'>
                    <h4>Copyright</h4>
                    <p className="footer-text">&copy; {new Date().getFullYear()} Prof. BSS Jr. College  All rights reserved | Designed and Developed by <strong>KSJ Techs</strong></p>
                </div>
            </footer>
        </main>
    );
}

export default LandingPage;
