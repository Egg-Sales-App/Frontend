// React hooks for managing state, side effects, and memoized callbacks
import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fetching data from an API.
 * - Handles loading, error, and data states.
 * - Automatically fetches data on mount (or dependency change).
 * - Provides a refetch function to manually trigger API calls.
 *
 * @param {Function} apiFunction - The API function to call (must return a promise).
 * @param {Array} dependencies - Dependencies for re-creating fetchData (default: []).
 */
export const useApi = (apiFunction, dependencies = []) => {
  // Store fetched data
  const [data, setData] = useState(null);

  // Manage loading state
  const [loading, setLoading] = useState(true);

  // Manage error messages
  const [error, setError] = useState(null);

  /**
   * Fetches data using the provided API function.
   * - Uses useCallback so it doesn’t recreate unnecessarily.
   * - Accepts arguments (args) so you can customize the API call.
   */
  const fetchData = useCallback(
    async (...args) => {
      try {
        setLoading(true);   // Show loading while fetching
        setError(null);     // Reset error state

        // Await API response
        const result = await apiFunction(...args);
        setData(result);    // Store the response data
      } catch (err) {
        // Capture error message
        setError(err.message);
      } finally {
        // Always stop loading when done
        setLoading(false);
      }
    },
    dependencies // Re-run fetchData if dependencies change
  );

  /**
   * Automatically fetch data when the hook mounts
   * or when fetchData changes due to new dependencies.
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Function to manually re-fetch data (e.g., button click).
   */
  const refetch = useCallback(
    (...args) => {
      return fetchData(...args);
    },
    [fetchData]
  );

  // Return state + refetch for use in components
  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook for executing asynchronous actions (e.g., form submissions).
 * - Tracks loading and error state.
 * - Returns an execute function to wrap async logic safely.
 */
export const useAsyncAction = () => {
  // Loading state
  const [loading, setLoading] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  /**
   * Execute an async function safely with error handling.
   * Returns { success: true, data } on success,
   * or { success: false, error } on failure.
   */
  const execute = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoading(true);   // Show loading while running
      setError(null);     // Reset error state

      // Run async function
      const result = await asyncFunction(...args);
      return { success: true, data: result };
    } catch (err) {
      // Catch errors
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      // Stop loading after execution
      setLoading(false);
    }
  }, []);

  // Return helper functions + state
  return {
    loading,
    error,
    execute,
    clearError: () => setError(null), // Manually clear error
  };
};

// Default export for convenience, allows importing useApi directly
export default useApi;
