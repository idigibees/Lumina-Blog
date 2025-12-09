import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import AdUnit from '../components/AdUnit';

interface HomeProps {
  posts: BlogPost[];
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  const publishedPosts = posts.filter(p => p.published);
  const featuredPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract unique tags from all posts
  const allTags = Array.from(new Set(publishedPosts.flatMap(p => p.tags)));

  const filteredPosts = otherPosts.filter(p => {
    const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="pb-20">
      {/* Featured Hero Section */}
      {featuredPost && (
        <div className="relative w-full h-[600px] mb-12 group overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={featuredPost.coverImage} 
              alt={featuredPost.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                {featuredPost.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-xs font-bold tracking-wider uppercase">
                     {tag}
                   </span>
                ))}
                <span className="text-white/80 text-sm font-medium">Featured Story</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg">
                <Link to={`/post/${featuredPost.id}`} className="hover:text-indigo-200 transition-colors">
                  {featuredPost.title}
                </Link>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-2 max-w-2xl font-light">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3">
                    {featuredPost.authorAvatar && (
                        <img src={featuredPost.authorAvatar} alt={featuredPost.authorName} className="w-10 h-10 rounded-full border-2 border-white/30" />
                    )}
                    <div className="text-sm">
                        <p className="text-white font-semibold">{featuredPost.authorName}</p>
                        <p className="text-gray-300">{new Date(featuredPost.createdAt).toLocaleDateString()} • {Math.ceil(featuredPost.content.length / 500)} min read</p>
                    </div>
                 </div>
                 <Link to={`/post/${featuredPost.id}`} className="ml-auto md:ml-8 px-6 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
                    Read Article
                 </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Feed */}
          <div className="w-full lg:w-2/3">
             {/* Filter & Search Bar */}
             <div className="mb-10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Recent Stories</h2>
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Search stories..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white w-full md:w-64 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                
                {/* Tags Filter */}
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setActiveTag(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!activeTag ? 'bg-slate-900 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button 
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTag === tag ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
             </div>

             <div className="space-y-12">
               {filteredPosts.length > 0 ? (
                 filteredPosts.map(post => (
                   <article key={post.id} className="flex flex-col md:flex-row gap-6 md:gap-10 group cursor-pointer border-b border-gray-100 pb-12 last:border-0">
                      <div className="w-full md:w-2/5 aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wide">
                            {post.tags[0]}
                        </div>
                      </div>
                      <div className="w-full md:w-3/5 flex flex-col">
                         <div className="flex items-center gap-2 mb-3">
                             <img src={post.authorAvatar} className="w-6 h-6 rounded-full" alt="" />
                             <span className="text-sm font-medium text-slate-700">{post.authorName}</span>
                         </div>
                         <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                           <Link to={`/post/${post.id}`}>{post.title}</Link>
                         </h3>
                         <p className="text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-grow">{post.excerpt}</p>
                         <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{Math.ceil(post.content.length / 500)} min read</span>
                            </div>
                            <div className="flex items-center gap-1 text-indigo-500">
                                <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">Read</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                         </div>
                      </div>
                   </article>
                 ))
               ) : (
                 <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900">No stories found</h3>
                   <p className="text-gray-500">Try adjusting your search or filters.</p>
                 </div>
               )}
             </div>

             <div className="mt-16">
                <AdUnit slot="inline" className="bg-gradient-to-r from-gray-50 to-indigo-50 border-none shadow-sm" />
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-10">
            {/* Newsletter */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-xl font-serif font-bold mb-2 relative z-10">Weekly Digest</h3>
                <p className="text-gray-400 text-sm mb-6 relative z-10">Get the most important stories delivered to your inbox every Friday.</p>
                <div className="flex gap-2 relative z-10">
                    <input type="email" placeholder="Your email" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Join</button>
                </div>
            </div>

            <AdUnit slot="sidebar" />

            {/* Trending Tags Cloud */}
            <div>
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Discover More</h3>
               <div className="flex flex-wrap gap-2">
                 {['Technology', 'Design', 'Culture', 'Politics', 'Health', 'Science', 'Self', 'Business', 'Travel'].map(topic => (
                   <span key={topic} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-all hover:shadow-sm">
                     {topic}
                   </span>
                 ))}
               </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg shadow-indigo-500/25">
               <h3 className="text-2xl font-serif font-bold mb-3">Start Writing</h3>
               <p className="text-indigo-100 text-sm mb-6">Join our community of writers and share your unique voice with the world.</p>
               <Link to="/write" className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors shadow-md">
                 Create Post
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;