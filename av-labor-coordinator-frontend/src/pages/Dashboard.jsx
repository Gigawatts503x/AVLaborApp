import React, { useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useAssignments } from '../hooks/useAssignments';
import '../styles/Dashboard.css';
import { Button, Card, FormInput, Modal, Table, Alert, LoadingSpinner } from '../components'

/**
 * Dashboard Page - Main landing page with overview
 * Shows:
 * - Total events count
 * - Technicians on roster
 * - Open assignments
 * - Recent events summary
 * - Quick action buttons
 */
export default function Dashboard() {
  const { events, fetchEvents } = useEvents();
  const { assignments, fetchAssignments } = useAssignments();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const upcomingEvents = events.filter(
    (e) => new Date(e.startdate) > new Date()
  ).length;

  const totalAssignments = assignments.length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎯 AV Labor Coordinator</h1>
        <p>Event Management & Technician Scheduling</p>
      </header>
        <Button variant="primary">Click me</Button>
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Events</h3>
              <p className="stat-number">{events.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Upcoming</h3>
              <p className="stat-number">{upcomingEvents}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-content">
              <h3>Assignments</h3>
              <p className="stat-number">{totalAssignments}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <a href="/events" className="btn btn-primary">
              ➕ New Event
            </a>
            <a href="/technicians" className="btn btn-primary">
              👷 Manage Technicians
            </a>
            <a href="/schedule" className="btn btn-primary">
              📋 View Schedule
            </a>
          </div>
        </div>

        {/* Recent Events */}
        <div className="recent-section">
          <h2>Recent Events</h2>
          {events.length === 0 ? (
            <p className="empty-state">No events yet. Create one to get started!</p>
          ) : (
            <div className="event-list">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h4>{event.name}</h4>
                    <p>{event.clientname}</p>
                    <small>{event.startdate}</small>
                  </div>
                  <div className="event-actions">
                    <a href={`/events/${event.id}`} className="link">
                      View Details →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
