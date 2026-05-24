export default function StatusBadge({ status }) {
  const map = {
    Available: 'badge green',
    Assigned: 'badge blue',
    'Under Repair': 'badge orange',
    Retired: 'badge gray',
    Lost: 'badge red',
    Open: 'badge red',
    'In Progress': 'badge orange',
    Resolved: 'badge green',
    Closed: 'badge gray'
  };

  return <span className={map[status] || 'badge gray'}>{status}</span>;
}