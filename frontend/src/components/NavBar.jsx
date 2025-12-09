import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthed = Boolean(token);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="brand">Carbon Estimator</div>
      <nav className="nav-links">
        {isAuthed && (
          <Link className={location.pathname === '/estimate' ? 'active' : ''} to="/estimate">
            Estimate
          </Link>
        )}
        {!isAuthed && (
          <>
            <Link className={location.pathname === '/login' ? 'active' : ''} to="/login">
              Login
            </Link>
            <Link className={location.pathname === '/signup' ? 'active' : ''} to="/signup">
              Sign up
            </Link>
          </>
        )}
      </nav>
      <div className="user-chip">
        {isAuthed ? (
          <>
            <span className="muted">Signed in as</span>
            <strong>{user?.username}</strong>
            <button className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="muted">Not signed in</span>
        )}
      </div>
    </header>
  );
}

