import { useContext, useState, useCallback } from 'react';
import { DataStoreContext } from './DataStoreContext';
import { assignmentsAPI } from '../utils/api';

/**
 * useAssignments Hook - Manages technician assignments (25-field system)
 * ⚠️  CRITICAL: All 25 fields required for POST operations
 */
export const useAssignments = () => {
  const store = useContext(DataStoreContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssignments = useCallback(async (eventId) => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching assignments for event:', eventId);
      const data = await assignmentsAPI.getByEventId(eventId);
      store.updateAssignments(data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch assignments:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  // Create assignment - REQUIRES ALL 25 FIELDS
  const createAssignment = useCallback(async (assignmentData) => {
    try {
      console.log('➕ Creating assignment for event:', assignmentData.eventid);
      const newAssign = await assignmentsAPI.create(assignmentData);
      const eventId = assignmentData.eventid || assignmentData.eventId;
      await fetchAssignments(eventId);
      return newAssign;
    } catch (error) {
      console.error('❌ Failed to create assignment:', error.message);
      throw error;
    }
  }, [fetchAssignments]);

  const updateAssignment = useCallback(async (id, eventId, assignmentData) => {
    try {
      console.log('✏️  Updating assignment:', id);
      const updated = await assignmentsAPI.update(id, assignmentData);
      await fetchAssignments(eventId);
      return updated;
    } catch (error) {
      console.error('❌ Failed to update assignment:', error.message);
      throw error;
    }
  }, [fetchAssignments]);

  const deleteAssignment = useCallback(async (id, eventId) => {
    try {
      console.log('🗑️  Deleting assignment:', id);
      await assignmentsAPI.delete(id);
      await fetchAssignments(eventId);
    } catch (error) {
      console.error('❌ Failed to delete assignment:', error.message);
      throw error;
    }
  }, [fetchAssignments]);

  return {
    assignments: store.assignments,
    isLoading,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsByEventId: store.getAssignmentsByEventId,
    getAssignmentsByTechnicianId: store.getAssignmentsByTechnicianId,
    getAssignmentById: store.getAssignmentById,
  };
};

export default useAssignments;
