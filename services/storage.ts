import { User, BlogPost, Comment } from '../types';
import { INITIAL_POSTS, INITIAL_USERS } from './mockData';

const USERS_KEY = 'lumina_users';
const POSTS_KEY = 'lumina_posts';
const CURRENT_USER_KEY = 'lumina_current_user';
const LIKED_POSTS_KEY = 'lumina_liked_posts'; // Store IDs of posts user has liked

export const StorageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : INITIAL_USERS;
  },

  getPosts: (): BlogPost[] => {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : INITIAL_POSTS;
  },

  savePost: (post: BlogPost) => {
    const posts = StorageService.getPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  deletePost: (id: string) => {
    const posts = StorageService.getPosts().filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  login: (email: string): User | null => {
    const users = StorageService.getUsers();
    // Simple simulation: Login with any valid email from mock data
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(LIKED_POSTS_KEY); // Optional: clear liked posts on logout
  },

  // Simulated ad revenue increment
  incrementRevenue: (authorId: string, amount: number) => {
    const users = StorageService.getUsers();
    const userIndex = users.findIndex(u => u.id === authorId);
    if (userIndex >= 0) {
      users[userIndex].earnings += amount;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current user if it's the same person
      const currentUser = StorageService.getCurrentUser();
      if (currentUser && currentUser.id === authorId) {
        currentUser.earnings += amount;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }
    }
  },

  incrementView: (postId: string) => {
    const posts = StorageService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
        posts[postIndex].views += 1;
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  toggleLike: (postId: string): boolean => {
    const posts = StorageService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return false;

    // Check if user already liked (local simulation per browser)
    const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || '[]');
    const hasLiked = likedPosts.includes(postId);
    
    let isLikedNow = false;

    if (hasLiked) {
        posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1);
        const newLiked = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(newLiked));
        isLikedNow = false;
    } else {
        posts[postIndex].likes += 1;
        likedPosts.push(postId);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likedPosts));
        isLikedNow = true;
    }
    
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return isLikedNow;
  },

  hasLiked: (postId: string): boolean => {
      const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || '[]');
      return likedPosts.includes(postId);
  },

  addComment: (postId: string, comment: Comment) => {
      const posts = StorageService.getPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex >= 0) {
          posts[postIndex].comments.push(comment);
          localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      }
  }
};