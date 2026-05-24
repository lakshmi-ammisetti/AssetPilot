import { useEffect, useState } from 'react';
import { getEmployeeAssets } from '../services/api';
import AssetTable from '../components/AssetTable';

export default function AssignedAssets() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) loadAssets(userId);
  }, []);

  const loadAssets = async (id) => {
    try {
      const data = await getEmployeeAssets(id);
      setAssets(data);
    } catch (err) {
      setAssets([]);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Assigned Assets</h1>
          <p className="muted">Assets currently assigned to you</p>
        </div>
      </div>

      <AssetTable assets={assets} />
    </div>
  );
}