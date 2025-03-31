import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        role,
        email
      });
      alert('注册成功！');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>注册新账号</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="姓名" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="email" 
          placeholder="邮箱" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="密码" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="athlete">运动员</option>
          <option value="staff">普通员工</option>
          <option value="admin">管理人员</option>
        </select>
        <button 
          type="submit"
          style={{ 
            padding: '10px', 
            backgroundColor: '#0066CC', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          注册
        </button>
      </form>
    </div>
  );
}