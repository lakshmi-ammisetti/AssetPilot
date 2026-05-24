import { useState } from 'react';
import { createMaintenance } from '../services/api';

export default function MaintenanceForm() {
  const [formData, setFormData] = useState({
    asset_id: '',
    employee_id: localStorage.getItem('userId') || '',
    issue_description: '',
    attachment_url: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createMaintenance(formData);
      setMessage(result.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Raise Maintenance Request</h1>
          <p className="muted">Log asset issues for review</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <input
          type="text"
          name="asset_id"
          placeholder="Asset ID"
          value={formData.asset_id}
          onChange={handleChange}
        />

        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={formData.employee_id}
          onChange={handleChange}
        />

        <textarea
          name="issue_description"
          placeholder="Issue Description"
          value={formData.issue_description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="attachment_url"
          placeholder="Attachment URL"
          value={formData.attachment_url}
          onChange={handleChange}
        />

        <button type="submit">Submit Request</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}