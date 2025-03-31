import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [newGame, setNewGame] = useState({ date: '', opponent: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取公告
        const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
        setAnnouncements(announcementsSnapshot.docs.map(doc => doc.data()));
        
        // 获取赛程
        const scheduleSnapshot = await getDocs(collection(db, 'schedule'));
        setSchedule(scheduleSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'announcements'), {
        ...newAnnouncement,
        date: new Date().toISOString().split('T')[0]
      });
      setNewAnnouncement({ title: '', content: '' });
      alert('公告发布成功！');
      // 刷新数据
      const snapshot = await getDocs(collection(db, 'announcements'));
      setAnnouncements(snapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error("Error adding announcement: ", error);
    }
  };

  const addGame = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'schedule'), newGame);
      setNewGame({ date: '', opponent: '', location: '' });
      alert('比赛添加成功！');
      // 刷新数据
      const snapshot = await getDocs(collection(db, 'schedule'));
      setSchedule(snapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error("Error adding game: ", error);
    }
  };

  if (loading) return <div>Loading data...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>管理员面板</h1>
      <button 
        onClick={() => auth.signOut()}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#ff4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        退出登录
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>发布公告</h2>
          <form onSubmit={addAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="标题"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              required
              style={{ padding: '8px' }}
            />
            <textarea
              placeholder="内容"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              required
              style={{ padding: '8px', minHeight: '100px' }}
            />
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
              发布公告
            </button>
          </form>
        </div>
        
        <div>
          <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>添加比赛</h2>
          <form onSubmit={addGame} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="date"
              value={newGame.date}
              onChange={(e) => setNewGame({...newGame, date: e.target.value})}
              required
              style={{ padding: '8px' }}
            />
            <input
              type="text"
              placeholder="对手球队"
              value={newGame.opponent}
              onChange={(e) => setNewGame({...newGame, opponent: e.target.value})}
              required
              style={{ padding: '8px' }}
            />
            <input
              type="text"
              placeholder="比赛地点"
              value={newGame.location}
              onChange={(e) => setNewGame({...newGame, location: e.target.value})}
              required
              style={{ padding: '8px' }}
            />
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
              添加比赛
            </button>
          </form>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>现有公告</h2>
          {announcements.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {announcements.map((item, i) => (
                <li key={i} style={{ padding: '15px', marginBottom: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                  <p>{item.content}</p>
                  {item.date && <small style={{ color: '#666' }}>发布于: {item.date}</small>}
                </li>
              ))}
            </ul>
          ) : (
            <p>暂无公告</p>
          )}
        </div>
        
        <div>
          <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>比赛日程</h2>
          {schedule.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {schedule.map((game, i) => (
                <li key={i} style={{ padding: '15px', marginBottom: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                  <h3 style={{ marginTop: 0 }}>对阵: {game.opponent}</h3>
                  <p>日期: {game.date}</p>
                  <p>地点: {game.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>暂无比赛安排</p>
          )}
        </div>
      </div>
    </div>
  );
}