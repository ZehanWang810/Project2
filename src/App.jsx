import { useState, useEffect } from 'react';
import { auth } from './firebase';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>金州勇士内部系统</h1>
      <Register />
      <hr style={{ margin: '20px 0' }} />
      <Login />
    </div>
  );

  // 简单角色判断
  const isAdmin = user.email && user.email.includes('admin');
  
  return isAdmin ? <AdminPanel /> : <Dashboard />;
}

export default App;