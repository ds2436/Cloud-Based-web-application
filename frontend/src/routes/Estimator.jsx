import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

export default function Estimator() {
  const { client } = useAuth();
  const [form, setForm] = useState({
    activity_id: 'electricity-supply_grid-source_residual_mix',
    data_version: '^21',
    value: 4200,
    valueKey: 'energy',
    unitKey: 'energy_unit',
    unit: 'kWh',
  });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    client
      .get('/history')
      .then(({ data }) => setHistory(data))
      .catch(() => setHistory([]));
  }, [client]);

  const chartData = useMemo(() => {
    if (!history.length) return [];
    return history
      .slice()
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((item) => ({
        x: new Date(item.timestamp),
        y: Number(item.co2e) || 0,
      }));
  }, [history]);

  const maxY = useMemo(() => (chartData.length ? Math.max(...chartData.map((p) => p.y)) : 0), [chartData]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const parameters = {
      [form.valueKey]: Number(form.value),
      [form.unitKey]: form.unit,
    };

    try {
      const { data } = await client.post('/estimate', {
        activity_id: form.activity_id,
        data_version: form.data_version || undefined,
        parameters,
      });
      setResult(data.entry);
      setHistory((prev) => [data.entry, ...prev]);
    } catch (err) {
      const message = err.response?.data?.error || 'Estimate failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <Card
        title="Estimate emissions"
        footer={
          <small className="muted">
            Uses Climatiq conversion factors. Try changing activity_id or units to explore.
          </small>
        }
      >
        <form className="form grid" onSubmit={handleSubmit}>
          <label className="full">
            Activity ID
            <input
              type="text"
              required
              value={form.activity_id}
              onChange={(e) => setForm({ ...form, activity_id: e.target.value })}
            />
          </label>
          <label>
            Data version (optional)
            <input
              type="text"
              placeholder="^21"
              value={form.data_version}
              onChange={(e) => setForm({ ...form, data_version: e.target.value })}
            />
          </label>
          <label>
            Parameter key
            <input
              type="text"
              required
              value={form.valueKey}
              onChange={(e) => setForm({ ...form, valueKey: e.target.value || 'energy' })}
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0"
              step="any"
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </label>
          <label>
            Unit key
            <input
              type="text"
              required
              value={form.unitKey}
              onChange={(e) => setForm({ ...form, unitKey: e.target.value || 'energy_unit' })}
            />
          </label>
          <label>
            Unit value
            <input
              type="text"
              required
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </label>
          {error && <div className="error full">{error}</div>}
          <div className="actions full">
            <button type="submit" disabled={loading}>
              {loading ? 'Estimating…' : 'Estimate'}
            </button>
          </div>
        </form>
      </Card>

      {result && (
        <Card title="Latest estimate">
          <div className="result">
            <div className="stat">
              <div className="label">Activity</div>
              <div className="value">{result.activity_name}</div>
            </div>
            <div className="stat">
              <div className="label">CO2e</div>
              <div className="value">
                {result.co2e?.toLocaleString()} {result.co2e_unit}
              </div>
            </div>
            <div className="stat">
              <div className="label">When</div>
              <div className="value">{new Date(result.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </Card>
      )}

      <Card title="History">
        {history.length === 0 ? (
          <div className="muted">No estimates yet.</div>
        ) : (
          <div className="history">
            {history.map((item) => (
              <div key={item.id} className="history-row">
                <div>
                  <div className="label">Activity</div>
                  <div className="value">{item.activity_name}</div>
                </div>
                <div>
                  <div className="label">CO2e</div>
                  <div className="value">
                    {item.co2e?.toLocaleString()} {item.co2e_unit}
                  </div>
                </div>
                <div className="param-pills">
                  <div className="label">Parameters</div>
                  <div className="pill-row">
                    {Object.entries(item.parameters || {}).map(([k, v]) => (
                      <span key={k} className="pill">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="muted small">{new Date(item.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {history.length > 0 && (
        <Card
          title="CO2e trend"
          footer={
            <button type="button" className="link-btn" onClick={() => setShowChart((s) => !s)}>
              {showChart ? 'Hide chart' : 'Show chart'}
            </button>
          }
        >
          {showChart ? (
            <div className="chart-wrapper">
              {chartData.length < 2 ? (
                <div className="muted small">Add more estimates to see a trend.</div>
              ) : (
                <svg viewBox="0 0 100 40" className="chart">
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    points={chartData
                      .map((p, idx) => {
                        const x = (idx / (chartData.length - 1 || 1)) * 100;
                        const y = maxY ? 40 - (p.y / maxY) * 30 - 5 : 35;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {chartData.map((p, idx) => {
                    const x = (idx / (chartData.length - 1 || 1)) * 100;
                    const y = maxY ? 40 - (p.y / maxY) * 30 - 5 : 35;
                    return <circle key={idx} cx={x} cy={y} r="1.3" fill="#1d4ed8" />;
                  })}
                </svg>
              )}
              <div className="small muted">Values shown in {history[0]?.co2e_unit || 'unit'} over time.</div>
            </div>
          ) : (
            <div className="muted small">Chart hidden.</div>
          )}
        </Card>
      )}
    </div>
  );
}

