
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SimpleIndex = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("SimpleIndex component mounted");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">If you can see this, the app is now working!</p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button 
            onClick={() => navigate('/transactions')}
            className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Transactions
          </button>
          <button 
            onClick={() => navigate('/banking')}
            className="p-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Banking
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleIndex;
