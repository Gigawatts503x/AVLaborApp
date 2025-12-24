import React, { useEffect, useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import '../styles/EventsPage.css';
import { Button, Card, FormInput, Modal, Table, Alert, LoadingSpinner } from '../components'

/**
 * Events Management Page
 * Shows list of all events with CRUD operations
 */
export default function EventsPage() {
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent } =
    useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    clientname: '',
    clientcontact: '',
    clientphone: '',
    clientemail: '',
    startdate: '',
    enddate: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvent(editingId, formData);
        setEditingId(null);
      } else {
        await createEvent(formData);
      }
      setFormData({
        name: '',
        clientname: '',
        clientcontact: '',
        clientphone: '',
        clientemail: '',
        startdate: '',
        enddate: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>📅 Events Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              clientname: '',
              clientcontact: '',
              clientphone: '',
              clientemail: '',
              startdate: '',
              enddate: '',
            });
          }}
        >
          {showForm ? '✕ Cancel' : '➕ New Event'}
        </button>
      </div>

      {showForm && (
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Conference 2025"
              />
            </div>

            <div className="form-group">
              <label>Client Name *</label>
              <input
                type="text"
                name="clientname"
                value={formData.clientname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Person *</label>
              <input
                type="text"
                name="clientcontact"
                value={formData.clientcontact}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="clientphone"
                value={formData.clientphone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="clientemail"
                value={formData.clientemail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startdate"
                value={formData.startdate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="enddate"
                value={formData.enddate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '✏️ Update Event' : '➕ Create Event'}
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

      <div className="events-list">
        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create one to get started!</p>
          </div>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.clientname}</td>
                  <td>{event.clientcontact}</td>
                  <td>{event.startdate}</td>
                  <td>{event.enddate}</td>
                  <td className="actions">
                    <button
                      className="link-btn"
                      onClick={() => handleEdit(event)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="link-btn delete"
                      onClick={() => handleDelete(event.id)}
                    >
                      🗑️ Delete
                    </button>
                    <a href={`/events/${event.id}`} className="link-btn">
                      👁️ View
                    </a>
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
