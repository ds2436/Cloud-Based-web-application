import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Estimator from './routes/Estimator';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/estimate" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/estimate"
            element={
              <ProtectedRoute>
                <Estimator />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

