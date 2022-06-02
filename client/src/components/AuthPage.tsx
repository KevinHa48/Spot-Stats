import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import { token } from '../spotify-utils';

function AuthPage() {
  const [request, setRequest] = useState('');

  useEffect(() => {
    setRequest((token as string) || '');
  }, []);

  return (
    <div>
      {request ? (
        <Dashboard />
      ) : (
        <a href="http://localhost:8000/login">
          <button type="button">Login with Spotify</button>
        </a>
      )}
    </div>
  );
}
export default AuthPage;
