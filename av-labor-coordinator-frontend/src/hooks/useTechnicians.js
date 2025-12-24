import { useContext, useState, useCallback } from 'react';
import { DataStoreContext } from './DataStoreContext';
import { techniciansAPI } from '../utils/api';

/**
 * useTechnicians Hook - Manages technician roster
 */
export const useTechnicians = () => {
  const store = useContext(DataStoreContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTechnicians = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching technicians...');
      const data = await techniciansAPI.getAll();
      store.updateTechnicians(data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch technicians:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const createTechnician = useCallback(async (techData) => {
    try {
      console.log('➕ Creating technician:', techData.name);
      const newTech = await techniciansAPI.create(techData);
      await fetchTechnicians();
      return newTech;
    } catch (error) {
      console.error('❌ Failed to create technician:', error.message);
      throw error;
    }
  }, [fetchTechnicians]);

  const updateTechnician = useCallback(async (id, techData) => {
    try {
      console.log('✏️  Updating technician:', id);
      const updated = await techniciansAPI.update(id, techData);
      await fetchTechnicians();
      return updated;
    } catch (error) {
      console.error('❌ Failed to update technician:', error.message);
      throw error;
    }
  }, [fetchTechnicians]);

  const deleteTechnician = useCallback(async (id) => {
    try {
      console.log('🗑️  Deleting technician:', id);
      await techniciansAPI.delete(id);
      await fetchTechnicians();
    } catch (error) {
      console.error('❌ Failed to delete technician:', error.message);
      throw error;
    }
  }, [fetchTechnicians]);

  return {
    technicians: store.technicians,
    isLoading,
    fetchTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    getTechnicianById: store.getTechnicianById,
  };
};

export default useTechnicians;
