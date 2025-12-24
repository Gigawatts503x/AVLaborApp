import { useContext, useState, useCallback } from 'react';
import { DataStoreContext } from './DataStoreContext';
import { requirementsAPI } from '../utils/api';

/**
 * useRequirements Hook - Manages labor requirements
 */
export const useRequirements = () => {
  const store = useContext(DataStoreContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequirements = useCallback(async (eventId) => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching requirements for event:', eventId);
      const data = await requirementsAPI.getByEventId(eventId);
      store.updateRequirements(data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch requirements:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const createRequirement = useCallback(async (reqData) => {
    try {
      console.log('➕ Creating requirement:', reqData.position);
      const newReq = await requirementsAPI.create(reqData);
      await fetchRequirements(reqData.eventid || reqData.eventId);
      return newReq;
    } catch (error) {
      console.error('❌ Failed to create requirement:', error.message);
      throw error;
    }
  }, [fetchRequirements]);

  const updateRequirement = useCallback(async (id, eventId, reqData) => {
    try {
      console.log('✏️  Updating requirement:', id);
      const updated = await requirementsAPI.update(id, reqData);
      await fetchRequirements(eventId);
      return updated;
    } catch (error) {
      console.error('❌ Failed to update requirement:', error.message);
      throw error;
    }
  }, [fetchRequirements]);

  const deleteRequirement = useCallback(async (id, eventId) => {
    try {
      console.log('🗑️  Deleting requirement:', id);
      await requirementsAPI.delete(id);
      await fetchRequirements(eventId);
    } catch (error) {
      console.error('❌ Failed to delete requirement:', error.message);
      throw error;
    }
  }, [fetchRequirements]);

  return {
    requirements: store.requirements,
    isLoading,
    fetchRequirements,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    getRequirementsByEventId: store.getRequirementsByEventId,
    getRequirementById: store.getRequirementById,
  };
};

export default useRequirements;
