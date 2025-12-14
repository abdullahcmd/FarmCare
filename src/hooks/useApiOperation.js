import { useState, useCallback } from "react";

export const useApiOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      onSuccess,
      onError,
      successMessage = "Operation completed successfully",
      showSuccess = true,
      clearErrorOnStart = true,
      clearSuccessOnStart = true,
    } = options;

    try {
      setLoading(true);

      if (clearErrorOnStart) {
        setError(null);
      }

      if (clearSuccessOnStart) {
        setSuccess(null);
      }

      const result = await apiCall();

      if (showSuccess) {
        setSuccess(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      console.error("API operation failed:", err);

      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred";

      setError(errorMessage);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(null);
  }, []);

  return {
    loading,
    error,
    success,
    execute,
    clearError,
    clearSuccess,
    reset,
  };
};

export default useApiOperation;
