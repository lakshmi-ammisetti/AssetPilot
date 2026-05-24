import { useEffect, useState } from 'react';
import { getAssets } from '../services/api';
import Loader from '../components/Loader';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Use an explicit parameter inside fetchAssets to handle forced state changes seamlessly
  const fetchAssets = async (targetPage = page) => {
    try {
      const query = `?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}&status=${encodeURIComponent(status)}&page=${targetPage}&limit=5`;
      const data = await getAssets(query);
      setAssets(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Triggers automatically whenever pagination buttons alter the page index
  useEffect(() => {
    fetchAssets(page);
  }, [page]);

  const handleFilter = async () => {
    setPage(1); // Schedule state update for rendering
    setLoading(true);
    await fetchAssets(1); // 🌟 CRITICAL: Force page 1 into the query string immediately
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Assets</h1>
          <p className="muted">Search and monitor all inventory</p>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search asset name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Laptop">Laptop</option>
          <option value="Monitor">Monitor</option>
          <option value="Keyboard">Keyboard</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Repair">Under Repair</option>
          <option value="Retired">Retired</option>
          <option value="Lost">Lost</option>
        </select>

        <button onClick={handleFilter}>Apply</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tag</th>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">No assets found</td>
              </tr>
            ) : (
              assets.map((asset, index) => {
                // Calculates sequential line numbering moving forward: 1, 2, 3, 4, 5...
                const visualRowNumber = (page - 1) * 5 + (index + 1);

                // Safe color mapping system that avoids crashing on empty data
                const displayStatus = asset.status || 'Available';
                const lowerStatus = displayStatus.toLowerCase();
                
                let badgeColor = 'gray'; 
                if (lowerStatus === 'available') badgeColor = 'green';
                if (lowerStatus === 'assigned') badgeColor = 'blue';
                if (lowerStatus === 'under repair') badgeColor = 'orange';
                if (lowerStatus === 'lost' || lowerStatus === 'retired') badgeColor = 'red';

                return (
                  <tr key={asset.id}>
                    <td>{visualRowNumber}</td>
                    <td>{asset.asset_tag}</td>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.type}</td>
                    <td>
                      <span className={`badge ${badgeColor}`}>
                        {displayStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}