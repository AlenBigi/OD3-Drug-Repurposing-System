import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  // Auth check
  const token = localStorage.getItem('access_token');


  if (token) {
    return <Home />;
  }

  // Show auth screens if not logged in
  return (
    <>
      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
}

export default App;