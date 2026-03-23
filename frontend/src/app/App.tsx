import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import './lib/i18n';

/**
 * Main App Component
 * Entry point for the Edu Smart school management system
 */
function App() {
  useEffect(() => {
    document.title = "Edu Smart";
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
