
// Extend the Window interface to include marqeta property
interface Window {
  marqeta?: {
    initialize: (config: { applicationToken: string }) => void;
  };
}
