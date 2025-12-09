import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, loading, error } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signup(form);
      navigate('/estimate');
    } catch (_) {
      /* error handled in context */
    }
  }

  return (
    <div className="page">
      <Card
        title="Create account"
        footer={
          <div>
            Already have one? <Link to="/login">Login</Link>.
          </div>
        }
      >
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>
      </Card>
    </div>
  );
}

