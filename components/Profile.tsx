import React, { useState } from 'react';
import { UserStats, Badge } from '../types';
import { Settings, LogOut, Crown, Bell, Mail, Shield, ChevronRight, Share2, CheckCircle, Trash2 } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  badges: Badge[];
  onLogout: () => void;
  onUpgrade: () => void;
  onResetData: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, badges, onLogout, onUpgrade, onResetData }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  const handleShareBadge = (badge: Badge) => {
    if (badge.isLocked) return;
    
    const text = `I just earned the "${badge.name}" badge on EcoHabit! 🏆 ${badge.description}`;
    if (navigator.share) {
        navigator.share({
            title: `EcoHabit Badge: ${badge.name}`,
            text: text,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert(`Copied to clipboard: "${text}"`);
        navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100">
        <div className="flex items-center gap-4 mb-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 border-4 border-slate-50 shadow-sm">
                    JD
                </div>
                {stats.isPremium && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1 rounded-full border-2 border-white">
                        <Crown size={12} fill="currentColor" />
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    John Doe
                    {stats.isPremium && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Premium</span>}
                </h2>
                <p className="text-emerald-600 font-medium text-sm">Level {stats.level} Eco-Warrior</p>
                <p className="text-slate-400 text-xs mt-1">Joined January 2024</p>
            </div>
        </div>

        {/* Level Progress */}
        <div className="mb-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>XP Progress</span>
                <span>{stats.points} / 2000 XP</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" 
                    style={{ width: `${(stats.points / 2000) * 100}%` }}
                ></div>
            </div>
        </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto pb-20">
        
        {/* Premium Banner */}
        {!stats.isPremium ? (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                    <Crown size={100} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown size={20} className="text-yellow-300" fill="currentColor" />
                        <h3 className="font-bold text-lg">Go Premium</h3>
                    </div>
                    <p className="text-indigo-100 text-sm mb-4 max-w-[80%]">
                        Unlock advanced analytics, personalized coaching, and exclusive challenges.
                    </p>
                    <button 
                        onClick={onUpgrade}
                        className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors"
                    >
                        Upgrade for $2.99/mo
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <CheckCircle size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900 text-sm">Premium Member</h3>
                    <p className="text-xs text-indigo-700">You have access to all features.</p>
                </div>
            </div>
        )}

        {/* Badges Section */}
        <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center justify-between">
                Achievements 
                <span className="text-xs font-normal text-slate-500">{badges.filter(b => !b.isLocked).length} / {badges.length} Unlocked</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {badges.map(badge => (
                    <div 
                        key={badge.id} 
                        onClick={() => handleShareBadge(badge)}
                        className={`relative p-3 rounded-xl border transition-all ${
                            badge.isLocked 
                            ? 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-default' 
                            : 'bg-white border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 active:scale-95'
                        }`}
                    >
                        {!badge.isLocked && (
                            <div className="absolute top-2 right-2 text-emerald-600 opacity-0 hover:opacity-100 transition-opacity">
                                <Share2 size={14} />
                            </div>
                        )}
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-bold text-sm text-slate-800">{badge.name}</h4>
                        <p className="text-xs text-slate-500 leading-tight mt-1">{badge.description}</p>
                        {!badge.isLocked && badge.earnedDate && (
                            <p className="text-[10px] text-emerald-600 mt-2 font-medium">Earned {badge.earnedDate.toLocaleDateString()}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Settings size={18} className="text-slate-400"/> Settings
                </h3>
            </div>
            <div className="divide-y divide-slate-50">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Bell size={18}/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Push Notifications</p>
                            <p className="text-xs text-slate-400">Daily reminders & alerts</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>

                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-50 p-2 rounded-lg text-purple-500"><Mail size={18}/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Email Digest</p>
                            <p className="text-xs text-slate-400">Weekly summary report</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={emailDigest} onChange={() => setEmailDigest(!emailDigest)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>
                
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Shield size={18}/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Privacy & Data</p>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                </div>

                <div 
                    onClick={onResetData}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group border-t border-slate-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-50 p-2 rounded-lg text-orange-500 group-hover:bg-white"><Trash2 size={18}/></div>
                        <div>
                            <p className="text-sm font-semibold text-orange-600">Reset App Data</p>
                            <p className="text-[10px] text-slate-400">Clear progress & local storage</p>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={onLogout}
                    className="p-4 flex items-center justify-between hover:bg-red-50 cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-lg text-red-500 group-hover:bg-white"><LogOut size={18}/></div>
                        <div>
                            <p className="text-sm font-semibold text-red-600">Log Out</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;