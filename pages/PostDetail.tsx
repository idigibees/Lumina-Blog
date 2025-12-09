import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BlogPost, User } from '../types';
import { StorageService } from '../services/storage';
import AdUnit from '../components/AdUnit';

interface PostDetailProps {
  posts: BlogPost[];
  user: User | null;
}

const PostDetail: React.FC<PostDetailProps> = ({ posts, user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // State for immediate UI updates before storage sync/reload
  const [post, setPost] = useState<BlogPost | undefined>(posts.find(p => p.id === id));
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
     if (id) {
         const currentPosts = StorageService.getPosts();
         const p = currentPosts.find(x => x.id === id);
         setPost(p);
         if (p) {
             setIsLiked(StorageService.hasLiked(p.id));
             // Find related posts (exclude current, match tags, limit to 3)
             const related = currentPosts.filter(item => 
                 item.id !== p.id && 
                 item.tags.some(tag => p.tags.includes(tag))
             ).slice(0, 3);
             
             // If not enough related by tag, fill with recent
             if (related.length < 3) {
                 const remaining = currentPosts.filter(item => item.id !== p.id && !related.includes(item)).slice(0, 3 - related.length);
                 related.push(...remaining);
             }
             setRelatedPosts(related);
         }
     }
  }, [id, posts]);

  useEffect(() => {
    if (post && user && post.authorId !== user.id) {
        // Increment view count
        StorageService.incrementRevenue(post.authorId, 0.05);
        StorageService.incrementView(post.id);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-fade-in-up">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Story not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
      const newStatus = StorageService.toggleLike(post.id);
      setIsLiked(newStatus);
      // Update local state count
      setPost(prev => prev ? ({...prev, likes: prev.likes + (newStatus ? 1 : -1)}) : undefined);
  };

  const handleComment = () => {
      if (!user) {
          navigate('/login');
          return;
      }
      if (!commentText.trim()) return;

      const newComment = {
          id: `c-${Date.now()}`,
          authorId: user.id,
          authorName: user.name,
          authorAvatar: user.avatar,
          content: commentText,
          createdAt: new Date().toISOString()
      };

      StorageService.addComment(post.id, newComment);
      setPost(prev => prev ? ({...prev, comments: [...prev.comments, newComment]}) : undefined);
      setCommentText('');
  };

  return (
    <article className="bg-white min-h-screen animate-fade-in">
      {/* Article Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center md:text-left">
         <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
            {post.tags.map(tag => (
                <span key={tag} className="text-indigo-600 font-bold text-sm uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
                    {tag}
                </span>
            ))}
         </div>
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.15] mb-8">
            {post.title}
         </h1>
         <div className="flex flex-col md:flex-row items-center justify-between border-t border-b border-gray-100 py-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                 <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}`} alt={post.authorName} className="w-12 h-12 rounded-full ring-2 ring-gray-100" />
                 <div className="text-left">
                     <p className="font-bold text-slate-900 text-lg">{post.authorName}</p>
                     <p className="text-sm text-gray-500 font-medium">{new Date(post.createdAt).toLocaleDateString()} · {Math.ceil(post.content.length / 500)} min read</p>
                 </div>
            </div>
            <div className="flex gap-6 text-gray-400">
                <button className="hover:text-indigo-600 transition-colors" title="Share on Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </button>
                <button className="hover:text-indigo-600 transition-colors" title="Share on Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
                <button className="hover:text-indigo-600 transition-colors" title="Copy Link">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
            </div>
         </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[70vh] bg-gray-100 mb-16 overflow-hidden">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover object-center animate-fade-in"
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Floating Action Bar (Left Side Desktop) */}
        <div className="hidden lg:flex flex-col gap-8 fixed left-[calc(50%-48rem)] top-1/3 text-gray-400">
            <button 
                onClick={handleLike}
                className="group flex flex-col items-center gap-2 hover:text-indigo-600 transition-colors"
            >
                 <div className={`p-4 rounded-full transition-all shadow-sm border ${isLiked ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-indigo-100' : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'}`}>
                    <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                 </div>
                 <span className="text-sm font-bold font-mono">{post.likes}</span>
            </button>

             <button className="group flex flex-col items-center gap-2 hover:text-indigo-600 transition-colors">
                 <div className="p-4 bg-white border border-gray-100 rounded-full group-hover:border-indigo-200 group-hover:shadow-md transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                 </div>
                 <span className="text-sm font-bold font-mono">{post.comments.length}</span>
            </button>
        </div>

        {/* Content */}
        <div className="prose prose-xl prose-slate prose-headings:font-serif prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-2xl prose-img:shadow-soft mx-auto mb-20">
            {post.content.split('\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) return <h1 key={idx} className="text-slate-900 leading-tight">{paragraph.replace('# ', '')}</h1>
                if (paragraph.startsWith('## ')) return <h2 key={idx} className="text-slate-900">{paragraph.replace('## ', '')}</h2>
                if (paragraph.startsWith('### ')) return <h3 key={idx} className="text-slate-900">{paragraph.replace('### ', '')}</h3>
                if (paragraph.trim() === '') return <br key={idx} />;
                // Basic check for blockquotes if line starts with >
                if (paragraph.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-indigo-500 pl-4 italic text-gray-700 bg-gray-50 py-2 pr-2 rounded-r">{paragraph.replace('> ', '')}</blockquote>
                return <p key={idx} className="text-gray-700 font-light leading-8">{paragraph}</p>;
            })}
        </div>
        
        {/* Mobile Sticky Action Bar */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 rounded-full px-8 py-4 flex items-center gap-10 z-40">
             <button onClick={handleLike} className={`flex items-center gap-2 ${isLiked ? 'text-indigo-600' : 'text-slate-600'} transition-colors`}>
                <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-bold">{post.likes}</span>
             </button>
             <div className="w-px h-6 bg-gray-300"></div>
             <button className="flex items-center gap-2 text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-bold">{post.comments.length}</span>
             </button>
        </div>

        <div className="my-20">
           <div className="bg-slate-50 border-none rounded-2xl p-8 text-center relative overflow-hidden">
               <div className="relative z-10">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Advertisement</p>
                   <AdUnit slot="inline" className="bg-transparent border-none shadow-none" />
               </div>
           </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-100 pt-16">
             <div className="bg-white p-0 md:p-8 rounded-2xl">
                 <h3 className="text-3xl font-serif font-bold text-slate-900 mb-10">Responses ({post.comments.length})</h3>
                 
                 {/* Comment Form */}
                 <div className="mb-12 flex gap-4">
                     <div className="flex-shrink-0">
                         {user ? (
                             <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full ring-2 ring-gray-100" />
                         ) : (
                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                             </div>
                         )}
                     </div>
                     <div className="flex-grow">
                         {user ? (
                             <>
                                <div className="relative">
                                    <textarea 
                                        className="w-full bg-gray-50 border-0 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all min-h-[120px] resize-none text-slate-800 placeholder-gray-400"
                                        placeholder="Share your thoughts on this story..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={handleComment}
                                        disabled={!commentText.trim()}
                                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        Publish Response
                                    </button>
                                </div>
                             </>
                         ) : (
                             <div className="bg-gray-50 p-8 rounded-2xl text-center border border-dashed border-gray-200">
                                 <p className="text-gray-600 mb-4 font-medium">Join the conversation to leave a comment.</p>
                                 <div className="flex gap-4 justify-center">
                                     <button onClick={() => navigate('/login')} className="text-slate-900 font-bold hover:text-indigo-600 underline">Sign In</button>
                                     <span className="text-gray-300">|</span>
                                     <button onClick={() => navigate('/login')} className="text-slate-900 font-bold hover:text-indigo-600 underline">Sign Up</button>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>

                 {/* Comments List */}
                 <div className="space-y-10">
                     {post.comments.length > 0 ? post.comments.map(comment => (
                         <div key={comment.id} className="flex gap-4 group">
                              <img src={comment.authorAvatar || `https://ui-avatars.com/api/?name=${comment.authorName}`} alt={comment.authorName} className="w-10 h-10 rounded-full flex-shrink-0 shadow-sm" />
                              <div className="flex-grow">
                                  <div className="bg-white rounded-xl">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h4 className="font-bold text-slate-900 text-sm">{comment.authorName}</h4>
                                          <span className="text-gray-300 text-xs">•</span>
                                          <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                                  </div>
                              </div>
                         </div>
                     )) : (
                         <div className="text-center py-10">
                             <p className="text-gray-400 italic">No comments yet. Be the first to share your thoughts.</p>
                         </div>
                     )}
                 </div>
             </div>
        </div>
      </div>

      {/* Read Next Section */}
      <div className="bg-gray-50 py-20 mt-20 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 border-b border-gray-200 pb-4">Read Next</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map(rp => (
                      <Link key={rp.id} to={`/post/${rp.id}`} className="group block h-full">
                          <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 relative shadow-sm">
                              <img src={rp.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={rp.title} />
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide text-slate-800">
                                  {rp.tags[0]}
                              </div>
                          </div>
                          <h4 className="font-serif font-bold text-xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{rp.title}</h4>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{rp.excerpt}</p>
                          <div className="flex items-center gap-2">
                              <img src={rp.authorAvatar} className="w-6 h-6 rounded-full" />
                              <span className="text-xs font-bold text-gray-700">{rp.authorName}</span>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </div>
    </article>
  );
};

export default PostDetail;