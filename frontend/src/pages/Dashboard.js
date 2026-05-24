import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../services/api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!metrics) return <p className="page error">Error loading dashboard</p>;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Overview of assets and maintenance health</p>
        </div>
      </div>

      {/* FIXED: Added inline style to match your 3 metric cards cleanly into your 5-column CSS grid framework */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard title="Available" value={metrics.available} accent="green" />
        <StatCard title="Assigned" value={metrics.assigned} accent="blue" />
        <StatCard title="Under Repair" value={metrics.orange || metrics.underRepair} accent="orange" />
      </div>

      <div className="content-grid">
        <div className="card">
          <h3>Asset Type Distribution</h3>
          {(!metrics.usageByType || metrics.usageByType.length === 0) ? (
            <p className="muted">No data available</p>
          ) : (
            <ul className="list-clean">
              {metrics.usageByType.map((item) => (
                <li key={item.type}>
                  <span>{item.type || "Unknown"}</span>
                  <strong>{item.count}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Maintenance Reminders</h3>
          {(!metrics.maintenanceReminders || metrics.maintenanceReminders.length === 0) ? (
            <p className="muted" style={{ color: '#16a34a', fontWeight: '600' }}>
              ✓ All devices up to date
            </p>
          ) : (
            <ul className="list-clean">
              {metrics.maintenanceReminders.map((asset) => (
  <li key={asset.id}>
    <div>
      <span style={{ display: 'block', fontWeight: '500' }}>{asset.name}</span>
      <small className="muted" style={{ fontSize: '12px' }}>Tag: {asset.asset_tag}</small>
    </div>
    {/* This changes the status pill to show the last service date */}
    <strong className="badge orange" style={{ alignSelf: 'center', fontWeight: '500' }}>
      Last Service: {asset.last_serviced_date}
    </strong>
  </li>
))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}