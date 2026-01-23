
import React, { useState } from 'react';
import PublicStorefront from './components/PublicStorefront';
import AdminDashboard from './components/AdminDashboard';
import { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminAccess = () => {
    const key = prompt('Enter Studio Access Key:');
    if (key === 'luxe123') { // Simple demonstration of a secure key
      setIsAuthenticated(true);
      setView('admin');
    } else if (key !== null) {
      alert('Unauthorized access.');
    }
  };

  if (view === 'admin' && isAuthenticated) {
    return <AdminDashboard onExit={() => setView('public')} />;
  }

  return <PublicStorefront onAdminLink={handleAdminAccess} />;
};

export default App;
