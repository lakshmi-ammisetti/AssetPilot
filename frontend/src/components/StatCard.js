export default function StatCard({ title, value, subtext, accent = 'blue' }) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
}