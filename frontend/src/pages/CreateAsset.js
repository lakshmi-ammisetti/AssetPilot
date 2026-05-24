import { useState } from 'react';
import { createAsset } from '../services/api';

export default function CreateAsset() {
  const [formData, setFormData] = useState({
    asset_tag: '',
    name: '',
    category: '',
    type: '',
    status: 'Available',
    purchase_date: '',
    last_serviced_date: '',
    depreciation_value: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createAsset(formData);
      setMessage(result.message);
      } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Create Asset</h1>
          <p className="muted">Add new inventory asset</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <input name="asset_tag" placeholder="Asset Tag" onChange={handleChange} />
        <input name="name" placeholder="Asset Name" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />
        <input name="type" placeholder="Type" onChange={handleChange} />

        <select name="status" onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Repair">Under Repair</option>
          <option value="Retired">Retired</option>
          <option value="Lost">Lost</option>
        </select>
        <label>Purchase Date (When asset was bought)</label>
        <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
        />
        <label>Last Serviced Date (Last maintenance date)</label>
        <input
            type="date"
            name="last_serviced_date"
            value={formData.last_serviced_date}
            onChange={handleChange}
        />

        <input
          type="number"
          name="depreciation_value"
          placeholder="Depreciation Value"
          onChange={handleChange}
        />

        <button type="submit">Create Asset</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}