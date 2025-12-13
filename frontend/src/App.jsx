import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

function App() {
  const [isLogin, setIsLogin] = useState(true); // true = show Login, false = show Signup

  const handleSwitchToSignup = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  return (
    <>
      {isLogin ? (
        <Login onSwitchToSignup={handleSwitchToSignup} />
      ) : (
        <Signup onSwitchToLogin={handleSwitchToLogin} />
      )}
    </>
  );
}

export default App;