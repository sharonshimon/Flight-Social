import React from 'react'
import './Feed.css'
import Navbar from '../components/Navbar'
import LeftBar from '../components/LeftBar'
import RightBar from '../components/RightBar'
import Posts from '../components/Posts'

const Feed = () => {
  return (
    <div className="feed-bg" style={{ minHeight: '100vh', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <LeftBar />
        <div
          style={{
            flex: 6,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 60px)',
            padding: '20px'
          }}
        >
          <Posts count={10} />
        </div>
        <RightBar />
      </div>
    </div>
  );
}

export default Feed