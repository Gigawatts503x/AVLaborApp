import { useContext, useState, useCallback } from 'react';
import { DataStoreContext } from './DataStoreContext';
import { eventsAPI } from '../utils/api';

/**
 * useEvents Hook - Manages event data and operations
 * Provides CRUD operations for events
 */
export const useEvents = () => {
  const store = useContext(DataStoreContext);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching events...');
      const data = await eventsAPI.getAll();
      store.updateEvents(data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch events:', error.message);
      store.setError('Failed to fetch events');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  // Fetch single event
  const getEvent = useCallback(async (id) => {
    try {
      console.log('📥 Fetching event:', id);
      const data = await eventsAPI.getById(id);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch event:', error.message);
      throw error;
    }
  }, []);

  // Create event
  const createEvent = useCallback(async (eventData) => {
    try {
      console.log('➕ Creating event:', eventData.name);
      const newEvent = await eventsAPI.create(eventData);
      // Refresh events list
      await fetchEvents();
      return newEvent;
    } catch (error) {
      console.error('❌ Failed to create event:', error.message);
      store.setError('Failed to create event');
      throw error;
    }
  }, [fetchEvents, store]);

  // Update event
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      console.log('✏️  Updating event:', id);
      const updated = await eventsAPI.update(id, eventData);
      // Refresh events list
      await fetchEvents();
      return updated;
    } catch (error) {
      console.error('❌ Failed to update event:', error.message);
      throw error;
    }
  }, [fetchEvents]);

  // Delete event
  const deleteEvent = useCallback(async (id) => {
    try {
      console.log('🗑️  Deleting event:', id);
      await eventsAPI.delete(id);
      // Refresh events list
      await fetchEvents();
    } catch (error) {
      console.error('❌ Failed to delete event:', error.message);
      throw error;
    }
  }, [fetchEvents]);

  return {
    events: store.events,
    isLoading,
    fetchEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById: store.getEventById,
    getEventTotals: store.getEventTotals,
  };
};

export default useEvents;
