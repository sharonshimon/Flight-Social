import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Feed from "./pages/Feed/Feed";
import TagFeed from "./pages/FeedByTag/TagFeed";
import Friends from "./pages/Friends/Friends";
import Messages from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NewPost from "./pages/NewPost/newPost";
import MyGroups from "./pages/MyGroups/myGroups"
import AdminConsole from "./pages/Admin/AdminConsole";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* app chrome stays mounted */}
        <Route element={<Layout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/posts" element={<TagFeed />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/newPost" element={<NewPost />} />
          <Route path="/myGroups" element={<MyGroups />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}