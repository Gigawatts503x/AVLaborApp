import { createContext, useState, useCallback } from 'react';

/**
 * Data Store Context - Central state management for the entire app
 * Provides access to all entities (events, technicians, requirements, assignments)
 */
export const DataStoreContext = createContext();

export const DataStoreProvider = ({ children }) => {
  // State for all entities
  const [events, setEvents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [settings, setSettings] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Entity update callbacks
  const updateEvents = useCallback((newEvents) => {
    setEvents(newEvents);
    console.log('📊 Events updated:', newEvents.length);
  }, []);

  const updateTechnicians = useCallback((newTechnicians) => {
    setTechnicians(newTechnicians);
    console.log('👷 Technicians updated:', newTechnicians.length);
  }, []);

  const updateRequirements = useCallback((newRequirements) => {
    setRequirements(newRequirements);
    console.log('📋 Requirements updated:', newRequirements.length);
  }, []);

  const updateAssignments = useCallback((newAssignments) => {
    setAssignments(newAssignments);
    console.log('✍️  Assignments updated:', newAssignments.length);
  }, []);

  const updatePositions = useCallback((newPositions) => {
    setPositions(newPositions);
    console.log('🎯 Positions updated:', newPositions.length);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    console.log('⚙️  Settings updated');
  }, []);

  // Event helpers
  const getEventById = useCallback(
    (id) => events.find((e) => e.id === id),
    [events]
  );

  const getEventTotals = useCallback((eventId) => {
    const eventAssignments = assignments.filter((a) => a.eventid === eventId);
    return {
      totaltechpayout: eventAssignments.reduce((sum, a) => sum + (a.calculatedpay || 0), 0),
      totalcustomerbilling: eventAssignments.reduce((sum, a) => sum + (a.customerbill || 0), 0),
    };
  }, [assignments]);

  // Technician helpers
  const getTechnicianById = useCallback(
    (id) => technicians.find((t) => t.id === id),
    [technicians]
  );

  // Requirement helpers
  const getRequirementsByEventId = useCallback(
    (eventId) => requirements.filter((r) => r.eventid === eventId),
    [requirements]
  );

  const getRequirementById = useCallback(
    (id) => requirements.find((r) => r.id === id),
    [requirements]
  );

  // Assignment helpers
  const getAssignmentsByEventId = useCallback(
    (eventId) => assignments.filter((a) => a.eventid === eventId),
    [assignments]
  );

  const getAssignmentsByTechnicianId = useCallback(
    (techId) => assignments.filter((a) => a.technicianid === techId),
    [assignments]
  );

  const getAssignmentById = useCallback(
    (id) => assignments.find((a) => a.id === id),
    [assignments]
  );

  // Context value
  const value = {
    // State
    events,
    technicians,
    requirements,
    assignments,
    positions,
    settings,
    loading,
    error,

    // Setters
    setLoading,
    setError,
    updateEvents,
    updateTechnicians,
    updateRequirements,
    updateAssignments,
    updatePositions,
    updateSettings,

    // Helpers - Events
    getEventById,
    getEventTotals,

    // Helpers - Technicians
    getTechnicianById,

    // Helpers - Requirements
    getRequirementsByEventId,
    getRequirementById,

    // Helpers - Assignments
    getAssignmentsByEventId,
    getAssignmentsByTechnicianId,
    getAssignmentById,
  };

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
};

export default DataStoreContext;
