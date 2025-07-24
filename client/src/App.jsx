import { useState } from 'react'
import './App.css'
import FlightList from './FlightList.jsx'
import UserFlight from './UserFlight.jsx'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthForm from './components/Auth'
import LoadingSpinner from './components/LoadingSpinner'

const AuthenticatedApp = () => {
  const [refreshUserFlight, setRefreshUserFlight] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const { user, signOut } = useAuth();

  const toast = {
    success: (message) => setToastMessage({ type: 'success', message }),
    error: (message) => setToastMessage({ type: 'error', message }),
    info: (message) => {
      const id = Date.now();
      setToastMessage({ type: 'info', message, id });
      return id;
    }
  };

  // Expose toast functions globally for service layer
  window.showToast = (type, message) => {
    const id = Date.now();
    setToastMessage({ type, message, id });
    return id;
  };
  
  window.hideToast = (id) => {
    setToastMessage(prev => prev && prev.id === id ? null : prev);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="app-header">
          <h1>Flight Rebooking Assistant</h1>
          <div className="user-controls">
            <span>Welcome, {user?.email}</span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
        <ErrorBoundary>
          <UserFlight refreshTrigger={refreshUserFlight} toast={toast} />
        </ErrorBoundary>
        <hr />
        <ErrorBoundary>
          <FlightList onFlightBooked={() => setRefreshUserFlight(prev => !prev)} />
        </ErrorBoundary>
        {toastMessage && (
          <Toast
            toast={{
              id: toastMessage.id || Date.now(),
              type: toastMessage.type,
              message: toastMessage.message,
              duration: toastMessage.type === 'info' ? 0 : 3000
            }}
            onRemove={() => setToastMessage(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

const AuthWrapper = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('signin');

  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner />
        <p>Loading application...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-auth">
        <AuthForm 
          mode={authMode} 
          onToggleMode={setAuthMode}
          onSuccess={() => window.location.reload()}
        />
      </div>
    );
  }

  return <AuthenticatedApp />;
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}

export default App
