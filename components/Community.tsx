import React, { useState } from 'react';
import { Challenge, ForumPost } from '../types';
import { generateCampaignIdea, generateForumReply } from '../services/geminiService';
import { Users, Award, ChevronRight, Plus, Sparkles, Share2, X, MessageCircle, ThumbsUp, Send, CheckCircle } from 'lucide-react';

interface CommunityProps {
    challenges: Challenge[];
    onJoinChallenge: (id: string) => void;
    onAddChallenge: (challenge: Challenge) => void;
}

const MOCK_POSTS: ForumPost[] = [
    {
        id: 'p1',
        author: 'Sarah Green',
        content: 'Just started composting in my apartment! It is easier than I thought. 🪱',
        likes: 12,
        timestamp: new Date(Date.now() - 86400000),
        avatar: 'S'
    },
    {
        id: 'p2',
        author: 'EcoBot',
        content: 'Did you know? Composting can divert up to 30% of household waste from landfills!',
        likes: 45,
        timestamp: new Date(Date.now() - 86000000),
        isAi: true,
        avatar: '🤖'
    }
];

const Community: React.FC<CommunityProps> = ({ challenges, onJoinChallenge, onAddChallenge }) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'forum'>('challenges');
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleCreateChallenge = async () => {
    if (!topic.trim()) return;
    setLoadingChallenge(true);
    const newChallenge = await generateCampaignIdea(topic);
    if (newChallenge) {
      onAddChallenge(newChallenge);
      setIsCreating(false);
      setTopic('');
    }
    setLoadingChallenge(false);
  };

  const handleShare = (challenge: Challenge) => {
    if (navigator.share) {
        navigator.share({
            title: challenge.title,
            text: `Join the "${challenge.title}" challenge on EcoHabit! ${challenge.description}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert(`Copied to clipboard: Join the "${challenge.title}" challenge!`);
    }
  };

  const handlePost = async () => {
      if (!newPost.trim()) return;
      setIsPosting(true);
      
      const userPost: ForumPost = {
          id: Date.now().toString(),
          author: 'You',
          content: newPost,
          likes: 0,
          timestamp: new Date(),
          avatar: 'JD'
      };

      setPosts(prev => [userPost, ...prev]);
      const content = newPost;
      setNewPost('');

      if (process.env.API_KEY) {
         const reply = await generateForumReply(content);
         const botPost: ForumPost = {
             id: (Date.now() + 1).toString(),
             author: 'EcoBot',
             content: reply,
             likes: 0,
             timestamp: new Date(),
             isAi: true,
             avatar: '🤖'
         };
         setTimeout(() => {
            setPosts(prev => [botPost, ...prev]);
            setIsPosting(false);
         }, 1000);
      } else {
          setIsPosting(false);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Community</h2>
                <p className="text-slate-500 text-sm">Connect, share & grow</p>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Rank</span>
                <p className="text-xl font-bold text-slate-800">#42</p>
            </div>
          </div>
          
          <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setActiveTab('challenges')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'challenges' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Challenges
              </button>
              <button 
                onClick={() => setActiveTab('forum')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'forum' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Discussion
              </button>
          </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto pb-20">
        
        {activeTab === 'challenges' && (
            <>
                {!isCreating ? (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-all"
                    >
                        <Sparkles size={18} /> Create AI Campaign
                    </button>
                ) : (
                    <div className="bg-white p-4 rounded-xl shadow-md border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Sparkles size={16}/> New Campaign</h3>
                            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Enter a topic (e.g. "Food Waste") and AI will design a challenge.</p>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Topic..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateChallenge()}
                            />
                            <button 
                                onClick={handleCreateChallenge}
                                disabled={loadingChallenge || !topic.trim()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                            >
                                {loadingChallenge ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Plus size={16} />}
                                Create
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                {challenges.map((challenge) => (
                    <div key={challenge.id} className={`bg-white rounded-xl p-4 shadow-sm border relative overflow-hidden group ${challenge.isSponsored ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
                    {challenge.isSponsored && (
                        <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                            Sponsored by {challenge.sponsorName}
                        </div>
                    )}
                    <div className="flex justify-between items-start mb-3 mt-1">
                        <div className={`p-2 rounded-lg ${challenge.isSponsored ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {challenge.isSponsored ? <Sparkles size={20} /> : <Award size={20} />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <button 
                                onClick={() => handleShare(challenge)}
                                className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                            >
                                <Share2 size={16} />
                            </button>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {challenge.daysLeft} days left
                            </span>
                        </div>
                    </div>
                    
                    <h4 className="font-bold text-lg text-slate-800 mb-1">{challenge.title}</h4>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                    
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${challenge.isSponsored ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                        <span>{challenge.progress} / {challenge.target} {challenge.unit}</span>
                        <span className="flex items-center gap-1"><Users size={12}/> {challenge.participants} joined</span>
                    </div>

                    <button 
                        onClick={() => !challenge.isJoined && onJoinChallenge(challenge.id)}
                        disabled={challenge.isJoined}
                        className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                            challenge.isJoined 
                            ? 'bg-green-50 text-green-600 cursor-default'
                            : challenge.isSponsored
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-slate-800 text-white hover:bg-slate-900'
                        }`}
                    >
                        {challenge.isJoined ? <><CheckCircle size={14}/> Joined</> : 'Join Challenge'}
                    </button>
                    </div>
                ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Top Eco-Warriors</h3>
                        <button className="text-xs text-emerald-600 font-semibold flex items-center">View All <ChevronRight size={14}/></button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[1, 2, 3].map((rank) => (
                            <div key={rank} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-yellow-100 text-yellow-700' : rank === 2 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-800'}`}>
                                        {rank}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                    <span className="text-sm font-semibold text-slate-700">User_{100+rank}</span>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">{2000 - rank * 150} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}

        {activeTab === 'forum' && (
            <>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">JD</div>
                        <div className="flex-1">
                            <textarea 
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share a tip, ask a question, or celebrate a win..."
                                className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                                rows={2}
                            />
                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={handlePost}
                                    disabled={!newPost.trim() || isPosting}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isPosting ? 'Posting...' : <><Send size={14} /> Post</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${post.isAi ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {post.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                                {post.author}
                                                {post.isAi && <Sparkles size={12} className="text-emerald-500 fill-emerald-500"/>}
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                                {post.timestamp.toLocaleDateString() === new Date().toLocaleDateString() 
                                                    ? 'Today' 
                                                    : post.timestamp.toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 text-sm mt-2 leading-relaxed">{post.content}</p>
                                    
                                    <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                        <button className="flex items-center gap-1 text-slate-400 text-xs font-medium hover:text-emerald-600 transition-colors">
                                            <ThumbsUp size={14} /> {post.likes} Likes
                                        </button>
                                        <button className="flex items-center gap-1 text-slate-400 text-xs font-medium hover:text-indigo-600 transition-colors">
                                            <MessageCircle size={14} /> Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Community;