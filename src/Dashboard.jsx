import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function Dashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [schedule, setSchedule] = useState([]);
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

  if (loading) return <div>Loading data...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>欢迎使用金州勇士内部系统</h1>
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
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>最新公告</h2>
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
  );
}