import StatusBadge from './StatusBadge';

export default function AssetTable({ assets }) {
  return (
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
              <td className="empty" colSpan="6">No assets found</td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.asset_tag}</td>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>{asset.type}</td>
                <td><StatusBadge status={asset.status} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}