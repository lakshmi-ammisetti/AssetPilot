import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const role = localStorage.getItem('role');

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-title">AssetPilot</div>
        <div className="brand-subtitle">IT Infrastructure Control</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/assets" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
          Assets
        </NavLink>
        <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
          Maintenance
        </NavLink>
        <NavLink to="/maintenance-details" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
          Maintenance Details
        </NavLink>
        {role === 'employee' && (
          <NavLink to="/assigned-assets" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
            Assigned Assets
          </NavLink>
        )}
        {role === 'admin' && (
          <NavLink to="/admin-assets" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
            Admin Assets
          </NavLink>
        )}
        {role === 'admin' && (
            <NavLink
            to="/create-asset" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                Create Asset
            </NavLink>
            )}
      </nav>
    </aside>
  );
}