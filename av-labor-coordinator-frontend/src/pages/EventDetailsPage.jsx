import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useRequirements } from '../hooks/useRequirements';
import { useAssignments } from '../hooks/useAssignments';
import { useTechnicians } from '../hooks/useTechnicians';
import {
  calculateHoursBreakdown,
  calculateTechPayout,
  calculateBilling,
} from '../utils/rateCalculator';
import '../styles/EventDetailsPage.css';
import { Button, Card, FormInput, Modal, Table, Alert, LoadingSpinner } from '../components'

/**
 * Event Details Page
 * Shows complete event information with assignments and labor breakdown
 */
export default function EventDetailsPage() {
  const { id } = useParams();
  const { getEventById, getEventTotals } = useEvents();
  const { requirements, fetchRequirements } = useRequirements();
  const { assignments, fetchAssignments, createAssignment } = useAssignments();
  const { technicians } = useTechnicians();
  const [event, setEvent] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    technicianid: '',
    requirementid: '',
    position: '',
    roomorlocation: '',
    assignmentdate: '',
    starttime: '',
    endtime: '',
    ratetype: 'hourly',
  });

  useEffect(() => {
    const currentEvent = getEventById(id);
    setEvent(currentEvent);
    if (id) {
      fetchRequirements(id);
      fetchAssignments(id);
    }
  }, [id, getEventById, fetchRequirements, fetchAssignments]);

  const eventAssignments = assignments.filter((a) => a.eventid === id);
  const totals = getEventTotals(id);

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const selectedTech = technicians.find(
        (t) => t.id === assignmentForm.technicianid
      );
      const hours = calculateHoursBreakdown(
        assignmentForm.starttime,
        assignmentForm.endtime
      );

      const techPay = calculateTechPayout({
        ...hours,
        techhourlyrate: selectedTech.techhourlyrate,
      });

      const bill = calculateBilling({
        ...hours,
        billhourlyrate: selectedTech.billhourlyrate,
      });

      const newAssignment = {
        eventid: id,
        technicianid: assignmentForm.technicianid,
        requirementid: assignmentForm.requirementid,
        position: assignmentForm.position,
        roomorlocation: assignmentForm.roomorlocation,
        hoursworked: hours.totalHours,
        assignmentdate: assignmentForm.assignmentdate,
        starttime: assignmentForm.starttime,
        endtime: assignmentForm.endtime,
        basehours: hours.baseHours,
        othours: hours.otHours,
        dothours: hours.dtHours,
        ratetype: assignmentForm.ratetype,
        techhourlyrate: selectedTech.techhourlyrate,
        techhalfdayrate: selectedTech.techhalfdayrate,
        techfulldayrate: selectedTech.techfulldayrate,
        billhourlyrate: selectedTech.billhourlyrate,
        billhalfdayrate: selectedTech.billhalfdayrate,
        billfulldayrate: selectedTech.billfulldayrate,
        calculatedpay: techPay,
        customerbill: bill,
        notes: '',
      };

      await createAssignment(newAssignment);
      setAssignmentForm({
        technicianid: '',
        requirementid: '',
        position: '',
        roomorlocation: '',
        assignmentdate: '',
        starttime: '',
        endtime: '',
        ratetype: 'hourly',
      });
      setShowAssignmentForm(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    }
  };

  if (!event) {
    return <div className="loading">Loading event details...</div>;
  }

  return (
    <div className="event-details-container">
      <div className="event-header">
        <h1>{event.name}</h1>
        <div className="event-info-grid">
          <div className="info-item">
            <label>Client:</label>
            <p>{event.clientname}</p>
          </div>
          <div className="info-item">
            <label>Contact:</label>
            <p>{event.clientcontact}</p>
          </div>
          <div className="info-item">
            <label>Phone:</label>
            <p>{event.clientphone}</p>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <p>{event.clientemail}</p>
          </div>
          <div className="info-item">
            <label>Start:</label>
            <p>{event.startdate}</p>
          </div>
          <div className="info-item">
            <label>End:</label>
            <p>{event.enddate}</p>
          </div>
        </div>
      </div>

      <div className="event-totals">
        <div className="total-card">
          <h3>Tech Payout</h3>
          <p className="total-amount">${totals.totaltechpayout.toFixed(2)}</p>
        </div>
        <div className="total-card">
          <h3>Customer Billing</h3>
          <p className="total-amount">
            ${totals.totalcustomerbilling.toFixed(2)}
          </p>
        </div>
        <div className="total-card">
          <h3>Assignments</h3>
          <p className="total-amount">{eventAssignments.length}</p>
        </div>
      </div>

      <div className="assignments-section">
        <div className="section-header">
          <h2>Assignments</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowAssignmentForm(!showAssignmentForm)}
          >
            {showAssignmentForm ? '✕ Cancel' : '➕ New Assignment'}
          </button>
        </div>

        {showAssignmentForm && (
          <form className="assignment-form" onSubmit={handleCreateAssignment}>
            <div className="form-grid">
              <div className="form-group">
                <label>Technician *</label>
                <select
                  name="technicianid"
                  value={assignmentForm.technicianid}
                  onChange={handleAssignmentChange}
                  required
                >
                  <option value="">Select technician</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Position *</label>
                <input
                  type="text"
                  name="position"
                  value={assignmentForm.position}
                  onChange={handleAssignmentChange}
                  required
                  placeholder="e.g., Audio Tech"
                />
              </div>

              <div className="form-group">
                <label>Room/Location *</label>
                <input
                  type="text"
                  name="roomorlocation"
                  value={assignmentForm.roomorlocation}
                  onChange={handleAssignmentChange}
                  required
                  placeholder="e.g., Main Stage"
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="assignmentdate"
                  value={assignmentForm.assignmentdate}
                  onChange={handleAssignmentChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  name="starttime"
                  value={assignmentForm.starttime}
                  onChange={handleAssignmentChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  name="endtime"
                  value={assignmentForm.endtime}
                  onChange={handleAssignmentChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                ➕ Create Assignment
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAssignmentForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="assignments-list">
          {eventAssignments.length === 0 ? (
            <p className="empty">No assignments yet</p>
          ) : (
            <table className="assignments-table">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Tech Pay</th>
                  <th>Bill Amount</th>
                </tr>
              </thead>
              <tbody>
                {eventAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>
                      {technicians.find((t) => t.id === assignment.technicianid)
                        ?.name || 'Unknown'}
                    </td>
                    <td>{assignment.position}</td>
                    <td>{assignment.assignmentdate}</td>
                    <td>{assignment.hoursworked.toFixed(2)}h</td>
                    <td>${assignment.calculatedpay.toFixed(2)}</td>
                    <td>${assignment.customerbill.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
