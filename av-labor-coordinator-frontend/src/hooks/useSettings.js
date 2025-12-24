import { useContext, useState, useCallback } from 'react';
import { DataStoreContext } from './DataStoreContext';
import { positionsAPI, settingsAPI } from '../utils/api';

/**
 * useSettings Hook - Manages app configuration, positions, and global settings
 */
export const useSettings = () => {
  const store = useContext(DataStoreContext);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching settings...');
      const data = await settingsAPI.get();
      store.updateSettings(data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch settings:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  // Update settings
  const updateSettings = useCallback(async (settingsData) => {
    try {
      console.log('✏️  Updating settings...');
      const updated = await settingsAPI.update(settingsData);
      store.updateSettings(updated);
      return updated;
    } catch (error) {
      console.error('❌ Failed to update settings:', error.message);
      throw error;
    }
  }, [store]);

  // Fetch positions
  const fetchPositions = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching positions...');
      const data = await positionsAPI.getAll();
      store.updatePositions(data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch positions:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  // Create position
  const createPosition = useCallback(async (positionData) => {
    try {
      console.log('➕ Creating position:', positionData.name);
      const newPos = await positionsAPI.create(positionData);
      await fetchPositions();
      return newPos;
    } catch (error) {
      console.error('❌ Failed to create position:', error.message);
      throw error;
    }
  }, [fetchPositions]);

  // Delete position
  const deletePosition = useCallback(async (name) => {
    try {
      console.log('🗑️  Deleting position:', name);
      await positionsAPI.delete(name);
      await fetchPositions();
    } catch (error) {
      console.error('❌ Failed to delete position:', error.message);
      throw error;
    }
  }, [fetchPositions]);

  return {
    settings: store.settings,
    positions: store.positions,
    isLoading,
    fetchSettings,
    updateSettings,
    fetchPositions,
    createPosition,
    deletePosition,
  };
};

export default useSettings;
