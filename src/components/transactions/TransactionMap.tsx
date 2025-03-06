
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Transaction {
  id: string;
  amount: number;
  location?: any;
  merchant_name?: string;
  customer_email?: string;
  currency?: string;
}

interface TransactionMapProps {
  transactions: Transaction[];
}

const TransactionMap: React.FC<TransactionMapProps> = ({ transactions }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load Leaflet library from CDN
    const loadLeaflet = () => {
      // Load CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    // Initialize map
    const initializeMap = () => {
      if (!mapContainerRef.current) return;
      
      if (mapRef.current) {
        mapRef.current.remove();
      }

      try {
        const L = window.L;
        mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        // Add markers for transactions
        transactions.forEach(transaction => {
          if (transaction.location) {
            try {
              // Parse location string like "POINT(longitude latitude)"
              const matches = transaction.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
              if (matches && matches.length === 3) {
                const lng = parseFloat(matches[1]);
                const lat = parseFloat(matches[2]);
                
                if (!isNaN(lng) && !isNaN(lat)) {
                  const marker = L.marker([lat, lng]).addTo(mapRef.current);
                  marker.bindPopup(`
                    <b>${transaction.merchant_name || 'Transaction'}</b><br>
                    Amount: ${transaction.currency || '$'}${transaction.amount}<br>
                    ${transaction.customer_email ? `Customer: ${transaction.customer_email}` : ''}
                  `);
                }
              }
            } catch (err) {
              console.error('Error parsing location data:', err);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error",
          description: "Failed to initialize transaction map.",
          variant: "destructive"
        });
      }
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [transactions, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainerRef} 
          style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
          className="border"
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Map shows the geographical distribution of your transactions.
        </p>
      </CardContent>
    </Card>
  );
};

export default TransactionMap;
