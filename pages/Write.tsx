import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BlogPost } from '../types';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/geminiService';

interface WriteProps {
  user: User | null;
  onSave: (post: BlogPost) => void;
}

const Write: React.FC<WriteProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleGenerateIdeas = async () => {
      setLoadingAI(true);
      const ideas = await GeminiService.generateBlogIdeas(tags || "Technology");
      setAiSuggestion(ideas);
      setLoadingAI(false);
  };

  const handleEnhanceContent = async () => {
      if (!content) return;
      setLoadingAI(true);
      const enhanced = await GeminiService.enhanceContent(content);
      setContent(enhanced);
      setLoadingAI(false);
  };

  const handlePublish = async () => {
    if (!title || !content) {
        alert("Please fill in title and content");
        return;
    }
    
    // Auto-generate cover image based on title
    const coverImagePrompt = await GeminiService.generateImagePrompt(title);
    const randomId = Math.floor(Math.random() * 1000) + 1;

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title,
      excerpt: content.substring(0, 150) + '...',
      content,
      coverImage: `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&w=1200&q=80`, // Using unsplash fallback
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      published: true,
      comments: []
    };

    StorageService.savePost(newPost);
    onSave(newPost); 
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Editor */}
            <div className="flex-grow max-w-4xl">
               <input 
                 type="text" 
                 placeholder="Title" 
                 className="w-full text-5xl font-serif font-bold placeholder-gray-300 border-none focus:ring-0 px-0 bg-transparent text-slate-900 mb-6"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 autoFocus
               />
               
               <textarea 
                 ref={textareaRef}
                 placeholder="Tell your story..." 
                 className="editor-textarea w-full min-h-[60vh] text-xl text-gray-700 leading-relaxed border-none focus:ring-0 px-0 resize-none bg-transparent font-serif"
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
               />
            </div>

            {/* Sidebar Tools */}
            <div className="lg:w-80 flex-shrink-0">
               <div className="sticky top-24 space-y-6">
                  {/* Publish Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                      <button 
                        onClick={handlePublish}
                        className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-full font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
                      >
                        Publish Now
                      </button>
                      <div className="mt-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Topics</label>
                        <input 
                          type="text" 
                          className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g. Tech, Life"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                        />
                      </div>
                  </div>

                  {/* AI Assistant Card */}
                  <div className="bg-gradient-to-b from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                          <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                      </div>
                      <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                          Gemini Assistant
                      </h4>
                      <p className="text-xs text-indigo-700/80 mb-4">Stuck? Let AI help you draft.</p>
                      
                      <div className="space-y-2">
                          <button 
                              onClick={handleGenerateIdeas}
                              disabled={loadingAI}
                              className="w-full py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg shadow-sm hover:shadow border border-indigo-100 transition-all flex justify-center items-center gap-2"
                          >
                              {loadingAI ? <span className="animate-spin">⟳</span> : '✨ Generate Ideas'}
                          </button>
                          <button 
                              onClick={handleEnhanceContent}
                              disabled={loadingAI || !content}
                              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                          >
                              {loadingAI ? <span className="animate-spin">⟳</span> : '🪄 Fix Grammar & Tone'}
                          </button>
                      </div>

                      {aiSuggestion && (
                          <div className="mt-4 p-3 bg-white/80 backdrop-blur rounded-lg border border-indigo-50 text-xs text-slate-700 whitespace-pre-wrap shadow-inner max-h-40 overflow-y-auto">
                              {aiSuggestion}
                          </div>
                      )}
                  </div>
               </div>
            </div>

          </div>
      </div>
    </div>
  );
};

export default Write;