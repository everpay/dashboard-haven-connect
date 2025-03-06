
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define the Transaction interface
interface Transaction {
  id: string;
  amount: number;
  location?: string;
  currency?: string;
  merchant_name?: string;
  status?: string;
  customer_email?: string;
}

const TransactionMap: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  useEffect(() => {
    if (!mapRef.current || mapInitialized) return;
    
    // Dynamically import Leaflet to avoid window.L errors
    const loadLeaflet = async () => {
      try {
        // Dynamically import leaflet
        const L = (await import('leaflet')).default;
        
        // Import leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        // Initialize map
        const map = L.map(mapRef.current).setView([40, -95], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add markers for transactions with location data
        transactions.forEach(transaction => {
          if (transaction.location) {
            try {
              // Parse the location string to extract coordinates
              const match = transaction.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
              if (match) {
                const lng = parseFloat(match[1]);
                const lat = parseFloat(match[2]);
                
                // Create marker with popup
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup(`
                  <b>${transaction.merchant_name || 'Transaction'}</b><br>
                  Amount: ${transaction.currency || '$'}${transaction.amount}<br>
                  Status: ${transaction.status || 'Unknown'}<br>
                  Email: ${transaction.customer_email || 'Not provided'}
                `);
              }
            } catch (err) {
              console.error("Error parsing location:", err);
            }
          }
        });
        
        // Adjust map view after adding markers
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
        
        setMapInitialized(true);
        
        // Cleanup on unmount
        return () => {
          map.remove();
        };
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };
    
    loadLeaflet();
  }, [transactions, mapInitialized]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="h-[400px] w-full rounded-md bg-gray-100"
        >
          {!mapInitialized && (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Loading map...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionMap;
