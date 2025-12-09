import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost, User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface AdminProps {
  user: User | null;
  posts: BlogPost[];
  onDeletePost: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ user, posts, onDeletePost }) => {
  const navigate = useNavigate();
  const users = StorageService.getUsers();
  const activeTabState = useState<'posts' | 'users' | 'analytics'>('posts');
  const [activeTab, setActiveTab] = activeTabState;

  if (!user || user.role !== UserRole.ADMIN) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-soft max-w-md animate-fade-in-up">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                <p className="text-gray-500 mb-6 text-sm">You must be an administrator to view this dashboard.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">Go Home</button>
            </div>
        </div>
    )
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        StorageService.deletePost(id);
        onDeletePost(id);
    }
  }

  // Dynamic Stats
  const totalViews = posts.reduce((acc, curr) => acc + curr.views, 0);
  const totalEarnings = users.reduce((acc, curr) => acc + curr.earnings, 0);
  
  // Calculate top performing posts for the chart
  const top5Posts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
  // Normalize for chart width (100%)
  const maxView = top5Posts[0]?.views || 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.name}. Here's what's happening today.</p>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Report
          </button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         {[
             { label: 'Total Users', value: users.length, icon: 'Users', change: '+12%', changeColor: 'text-green-500' },
             { label: 'Published Stories', value: posts.length, icon: 'FileText', change: '+3', changeColor: 'text-green-500' },
             { label: 'Total Reads', value: totalViews.toLocaleString(), icon: 'Eye', change: '+24%', changeColor: 'text-green-500' },
             { label: 'Platform Revenue', value: `$${totalEarnings.toFixed(2)}`, icon: 'DollarSign', color: 'text-indigo-600', change: '+8%', changeColor: 'text-green-500' }
         ].map((stat, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col justify-between h-36 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                    <span className={`text-xs font-bold ${stat.changeColor} bg-green-50 px-2 py-1 rounded-full`}>{stat.change}</span>
                </div>
                <div>
                    <p className={`text-3xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">vs. previous 30 days</p>
                </div>
             </div>
         ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100/50 p-1.5 rounded-xl w-fit mb-8 border border-gray-200">
            {['posts', 'users', 'analytics'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                    {tab}
                </button>
            ))}
      </div>

      {/* Content Area */}
      <div className="bg-white shadow-soft rounded-2xl border border-gray-100 overflow-hidden min-h-[400px]">
        {activeTab === 'posts' && (
             <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-100">
             <thead className="bg-gray-50/50">
               <tr>
                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Post Details</th>
                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Engagement</th>
                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {posts.map((post) => (
                 <tr key={post.id} className="hover:bg-gray-50/80 transition-colors group">
                   <td className="px-6 py-4">
                     <div className="flex items-center">
                         <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg mr-4 bg-gray-100">
                            <img className="h-full w-full object-cover" src={post.coverImage} alt="" />
                         </div>
                         <div className="max-w-xs">
                            <div className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{post.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</div>
                         </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center">
                         <img className="h-6 w-6 rounded-full mr-2 ring-2 ring-white" src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}`} alt="" />
                         <span className="text-sm text-gray-600 font-medium">{post.authorName}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex gap-4 text-xs font-medium text-gray-500">
                         <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-1 rounded"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> {post.views}</span>
                         <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2 py-1 rounded"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {post.likes}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                       <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Published</span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button onClick={() => handleDelete(post.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all" title="Delete Post">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           </div>
        )}
        
        {activeTab === 'users' && (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" src={u.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-mono font-medium">
                    ${u.earnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-xs font-bold border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition-colors">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {activeTab === 'analytics' && (
            <div className="p-8 md:p-12">
                <div className="flex justify-between items-end mb-8">
                     <h3 className="text-xl font-bold text-slate-900">Top 5 Most Viewed Stories</h3>
                     <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-indigo-500">
                         <option>Last 30 Days</option>
                         <option>Last 7 Days</option>
                     </select>
                </div>
                
                {/* Horizontal Bar Chart */}
                <div className="space-y-6 mb-12">
                    {top5Posts.map((post, i) => {
                        const widthPercentage = Math.max(5, (post.views / maxView) * 100);
                        return (
                            <div key={post.id} className="w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-sm font-medium text-slate-700 truncate pr-4 max-w-[70%]">
                                        <span className="text-gray-400 font-mono mr-2">0{i+1}.</span>
                                        {post.title}
                                    </h4>
                                    <span className="text-sm font-bold text-indigo-600">{post.views.toLocaleString()} views</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-indigo-500 h-full rounded-full shadow-sm relative group cursor-pointer transition-all duration-1000 ease-out" 
                                        style={{ width: `${widthPercentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-slate-800 mb-4">Traffic Sources</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Organic Search</span>
                                <span className="font-bold text-slate-900">45%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Direct</span>
                                <span className="font-bold text-slate-900">30%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Social</span>
                                <span className="font-bold text-slate-900">25%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center">
                        <h4 className="font-bold text-slate-800 mb-2">Audience Growth</h4>
                        <p className="text-4xl font-serif font-bold text-indigo-600 mb-2">+1,240</p>
                        <p className="text-sm text-gray-500">New subscribers this month</p>
                        <button className="mt-6 text-indigo-600 font-bold text-sm hover:underline">View Audience Report &rarr;</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;