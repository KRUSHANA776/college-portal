import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ user, onLogout }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            onLogout();
            navigate('/');
        }
    };

    return (
        <header className="header">
            <nav className="navbar">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="Prof. BSS Jr College Logo" className="logo-img" /> 
                    <div className="logo-text-container">
                        <span className="logo-top-text">Gram Vikas Mandal Molgi</span>
                        <span className="logo-main-text">Prof. B.S.S. Art &amp; Sci Jr. College Molgi</span>
                    </div>
                </Link> 

                <div className={`nav-container ${isMenuOpen ? 'nav-active' : ''}`}>
                    {!user && (
                        <ul className="nav-menu">
                            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
                            <li><a href="#courses" onClick={() => setIsMenuOpen(false)}>Streams</a></li>
                            <li><a href="#staff" onClick={() => setIsMenuOpen(false)}>Staff</a></li>
                            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
                        </ul>
                    )}

                    {!user ? (
                        <div className="nav-actions">
                            <Link to="/login?role=student" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                                Student Portal
                            </Link>
                            <Link to="/login?role=teacher" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                                Faculty Access
                            </Link>
                        </div>
                    ) : (
                        <div className="nav-actions">
                            <span className="user-name">{user.name}</span>
                            <button className="btn btn-danger" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

                <div className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
                </div>
            </nav>
        </header>
    );
}

export default Header;
