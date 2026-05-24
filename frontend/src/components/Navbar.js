import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div>
        <h2>AssetPilot</h2>
        <p>Smart Asset & Maintenance Management</p>
      </div>

      <div className="topbar-right">
        {name && (
          <div className="user-chip">
            <span>{name}</span>
            <small>{role}</small>
          </div>
        )}
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}