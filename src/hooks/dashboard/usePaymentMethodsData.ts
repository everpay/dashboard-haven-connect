import { useState, useEffect } from 'react';

export const usePaymentMethodsData = (initialData: any[]) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setData(defaultData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Inside the usePaymentMethodsData hook, update the default data:
  const defaultData = [
    { name: 'Credit Card', value: 8500 },
    { name: 'PayPal', value: 5200 },
    { name: 'Bank Transfer', value: 4500 },
    { name: 'ACH', value: 3800 },
    { name: 'Wire', value: 3200 },
  ];

  return { data, isLoading };
};
