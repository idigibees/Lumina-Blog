import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Write from './pages/Write';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { StorageService } from './services/storage';
import { User, BlogPost } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Load initial data
    const currentUser = StorageService.getCurrentUser();
    setUser(currentUser);
    setPosts(StorageService.getPosts());
  }, []);

  const handlePostUpdate = (newPost: BlogPost) => {
    // Refresh posts from storage to ensure we have the latest
    // In a real app, this might just append to state, but storage is the source of truth here
    setPosts(StorageService.getPosts());
  };

  const handlePostDelete = (id: string) => {
      setPosts(posts.filter(p => p.id !== id));
  }

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/post/:id" element={<PostDetail posts={posts} user={user} />} />
          <Route path="/write" element={<Write user={user} onSave={handlePostUpdate} />} />
          <Route path="/admin" element={<Admin user={user} posts={posts} onDeletePost={handlePostDelete} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;