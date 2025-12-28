import { useState } from 'react';

interface PaymentConfig {
  email: string;
  amount: number;
  full_name: string;
  phone?: string;
  purpose: string;
}

interface UsePaystackReturn {
  initiatePayment: (config: PaymentConfig) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const usePaystack = (): UsePaystackReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (config: PaymentConfig) => {
    setLoading(true);
    setError(null);

    try {
      // Initialize payment with backend
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment initialization failed');
      }

      if (result.success && result.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = result.data.authorization_url;
      } else {
        throw new Error('Failed to get payment URL');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};
