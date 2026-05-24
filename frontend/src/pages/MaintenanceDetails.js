import { useState } from 'react';
import { getMaintenanceDetails, updateMaintenance } from '../services/api';

export default function MaintenanceDetails() {
  const [id, setId] = useState('');
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('Open');
  const [resolution, setResolution] = useState('');
  const [comment, setComment] = useState('');

  const loadDetails = async () => {
    try {
      const data = await getMaintenanceDetails(id);
      setDetails(data);
      setStatus(data.request.status);
      setResolution(data.request.resolution_details || '');
    } catch (err) {
      setDetails(null);
    }
  };

  const saveStatus = async () => {
    try {
      await updateMaintenance(id, {
        status,
        resolution_details: resolution,
        comment,
        user_id: localStorage.getItem('userId')
      });
      setComment('');
      loadDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Maintenance Details</h1>
          <p className="muted">Review and update request status</p>
        </div>
      </div>

      <div className="card form-card">
        <input
          type="text"
          placeholder="Maintenance Request ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={loadDetails}>Load Details</button>
      </div>

      {details && (
        <div className="card form-card">
          <p><b>Issue:</b> {details.request.issue_description}</p>
          <p><b>Status:</b> {details.request.status}</p>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Resolution details"
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comment"
          />

          <button onClick={saveStatus}>Update Status</button>

          <h3>Comments</h3>
          <ul>
            {details.comments.map((c) => (
              <li key={c.id}>{c.comment}</li>
            ))}
          </ul>

          <h3>Repair Logs</h3>
          <ul>
            {details.logs.map((l) => (
              <li key={l.id}>{l.action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}