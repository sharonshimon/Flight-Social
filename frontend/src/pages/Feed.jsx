import React from 'react'
import './Feed.css'
import Navbar from '../components/Navbar'
import LeftBar from '../components/LeftBar'
import RightBar from '../components/RightBar'
import Posts from '../components/Posts'

const Feed = () => {
  return (
    <div className="feed-bg">
      <Navbar />
      <div style={{ display: 'flex' }}>
        <LeftBar />
        <div style={{ flex: 6 }}>
          <Posts />
        </div>
        <RightBar />
      </div>
    </div>
  );
}

export default Feed