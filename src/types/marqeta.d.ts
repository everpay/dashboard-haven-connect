
interface MarqetaJS {
  initialize: (options: { applicationToken: string }) => void;
}

declare global {
  interface Window {
    marqeta?: MarqetaJS;
  }
}

export {};
