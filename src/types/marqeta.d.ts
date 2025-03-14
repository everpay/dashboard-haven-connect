
// Extend the Window interface to include marqeta property
interface Window {
  marqeta?: {
    initialize: (config: { 
      applicationToken: string;
      baseUrl?: string;
      adminAccessToken?: string;
    }) => void;
  };
}
