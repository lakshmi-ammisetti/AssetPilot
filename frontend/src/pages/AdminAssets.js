import { useEffect, useState } from "react";

const AdminAssets = () => {
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [, setAssetError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    loadAssets();
    loadUsers();
  }, []);

  const loadAssets = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/assets?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      
      const assetsList = Array.isArray(data) ? data : (data.assets || data.data || []);
      setAssets(assetsList);
      setAssetError("");
    } catch (err) {
      setAssetError("Failed to load assets data records.");
    }
  };
  const loadUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to load users");
    }
  };

  const assignAsset = async (assetId) => {
    const userId = selectedUser[assetId];
    if (!userId) return;

    setLoadingId(assetId);
    try {
      const res = await fetch(`${BASE_URL}/api/assets/${assetId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assigned_to: Number(userId) }),
      });

      if (res.ok) {
        setSuccessMessage("Asset assigned successfully!");
        await loadAssets(); // Refresh list to remove the now-assigned item
      }
    } catch (err) {
      setSuccessMessage("Assignment failed.");
    } finally {
      setLoadingId(null);
    }
  };

  const availableAssets = assets.filter(
    (a) => a.status && a.status.toLowerCase() === "available"
  );

  return (
    <div className="admin-asset-page">
      <h2>Admin Asset Management</h2>
      <p>Assign available assets to users.</p>

      {successMessage && <div className="admin-alert">{successMessage}</div>}

      <div className="asset-grid">
        {availableAssets.length > 0 ? (
          availableAssets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <h4>{asset.name}</h4>
              <p>ID: {asset.id} | Tag: {asset.asset_tag}</p>
              
              <select onChange={(e) => setSelectedUser({...selectedUser, [asset.id]: e.target.value})}>
                <option value="">Select User</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              
              <button onClick={() => assignAsset(asset.id)} disabled={loadingId === asset.id}>
                {loadingId === asset.id ? "Assigning..." : "Assign"}
              </button>
            </div>
          ))
        ) : (
          <p>No assets are currently available for assignment.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAssets;