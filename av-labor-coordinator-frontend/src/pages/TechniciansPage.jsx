import React, { useEffect, useState } from 'react';
import { useTechnicians } from '../hooks/useTechnicians';
import '../styles/TechniciansPage.css';
import { Button, Card, FormInput, Modal, Table, Alert, LoadingSpinner } from '../components'

/**
 * Technicians Management Page
 * Shows roster of all technicians with CRUD operations
 */
export default function TechniciansPage() {
  const {
    technicians,
    fetchTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
  } = useTechnicians();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    techhourlyrate: 0,
    techhalfdayrate: 0,
    techfulldayrate: 0,
    billhourlyrate: 0,
    billhalfdayrate: 0,
    billfulldayrate: 0,
  });

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTechnician(editingId, formData);
        setEditingId(null);
      } else {
        await createTechnician(formData);
      }
      setFormData({
        name: '',
        phone: '',
        email: '',
        techhourlyrate: 0,
        techhalfdayrate: 0,
        techfulldayrate: 0,
        billhourlyrate: 0,
        billhalfdayrate: 0,
        billfulldayrate: 0,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving technician:', error);
      alert('Failed to save technician');
    }
  };

  const handleEdit = (tech) => {
    setFormData(tech);
    setEditingId(tech.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this technician?')) {
      try {
        await deleteTechnician(id);
      } catch (error) {
        console.error('Error deleting technician:', error);
      }
    }
  };

  return (
    <div className="technicians-container">
      <div className="technicians-header">
        <h1>👷 Technicians Roster</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              phone: '',
              email: '',
              techhourlyrate: 0,
              techhalfdayrate: 0,
              techfulldayrate: 0,
              billhourlyrate: 0,
              billhalfdayrate: 0,
              billfulldayrate: 0,
            });
          }}
        >
          {showForm ? '✕ Cancel' : '➕ Add Technician'}
        </button>
      </div>

      {showForm && (
        <form className="tech-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Technician name"
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Tech Rates (What you pay)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Hourly Rate ($)</label>
                <input
                  type="number"
                  name="techhourlyrate"
                  value={formData.techhourlyrate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Half-Day Rate ($)</label>
                <input
                  type="number"
                  name="techhalfdayrate"
                  value={formData.techhalfdayrate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Full-Day Rate ($)</label>
                <input
                  type="number"
                  name="techfulldayrate"
                  value={formData.techfulldayrate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Billing Rates (What you charge)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Hourly Rate ($)</label>
                <input
                  type="number"
                  name="billhourlyrate"
                  value={formData.billhourlyrate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Half-Day Rate ($)</label>
                <input
                  type="number"
                  name="billhalfdayrate"
                  value={formData.billhalfdayrate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Full-Day Rate ($)</label>
                <input
                  type="number"
                  name="billfulldayrate"
                  value={formData.billfulldayrate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '✏️ Update Technician' : '➕ Add Technician'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="technicians-list">
        {technicians.length === 0 ? (
          <div className="empty-state">
            <p>No technicians yet. Add one to get started!</p>
          </div>
        ) : (
          <table className="technicians-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Tech Hourly</th>
                <th>Bill Hourly</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => (
                <tr key={tech.id}>
                  <td>{tech.name}</td>
                  <td>{tech.phone}</td>
                  <td>{tech.email}</td>
                  <td>${tech.techhourlyrate}</td>
                  <td>${tech.billhourlyrate}</td>
                  <td className="actions">
                    <button
                      className="link-btn"
                      onClick={() => handleEdit(tech)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="link-btn delete"
                      onClick={() => handleDelete(tech.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
