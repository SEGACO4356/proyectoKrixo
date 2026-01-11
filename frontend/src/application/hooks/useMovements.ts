'use client';

import { useState, useEffect, useCallback } from 'react';
import { movementService } from '@/infrastructure/api';
import type { Movement, CreateMovementInput } from '@/domain/entities';

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movementService.getAll();
      if (response.success && response.data) {
        setMovements(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movements');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerEntry = async (movement: CreateMovementInput) => {
    try {
      setError(null);
      const response = await movementService.registerEntry(movement);
      if (response.success && response.data) {
        setMovements(prev => [response.data!, ...prev]);
        return response.data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register entry';
      setError(message);
      throw new Error(message);
    }
  };

  const registerExit = async (movement: CreateMovementInput) => {
    try {
      setError(null);
      const response = await movementService.registerExit(movement);
      if (response.success && response.data) {
        setMovements(prev => [response.data!, ...prev]);
        return response.data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register exit';
      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return {
    movements,
    loading,
    error,
    fetchMovements,
    registerEntry,
    registerExit,
  };
}
