import React, { useEffect, useState } from 'react';
import { UserStats, UserAction, Challenge } from '../types';
import { StatCard } from './StatCard';
import { Droplets, Flame, Trophy, TrendingUp, Share2, Award, PieChart as PieIcon, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { generateEcoTip } from '../services/geminiService';

interface DashboardProps {
  stats: UserStats;
  recentActions: UserAction[];
  challenges?: Challenge[];
  onNavigateToRewards: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, recentActions, challenges = [], onNavigateToRewards }) => {
  const [tip, setTip] = useState<string>("Loading daily tip...");

  useEffect(() => {
    const fetchTip = async () => {
      if (process.env.API_KEY && navigator.onLine) {
         const t = await generateEcoTip();
         setTip(t);
      } else if (!navigator.onLine) {
        setTip("You are offline. Reconnect for AI tips!");
      } else {
        setTip("Add your API Key to unlock AI insights!");
      }
    };
    fetchTip();
  }, []);

  const handleShareStats = () => {
    const text = `I've saved ${stats.totalCarbonSaved.toFixed(1)}kg of CO₂ and reached Level ${stats.level} on EcoHabit! 🌍 #SustainableLiving #EcoHabit`;
    if (navigator.share) {
        navigator.share({
            title: 'My EcoHabit Impact',
            text: text,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert(`Copied to clipboard: "${text}"`);
        navigator.clipboard.writeText(text);
    }
  };

  const activeChallenges = challenges.filter(c => c.isJoined);

  // --- Dynamic Data Processing ---

  // 1. Calculate Weekly Data (Last 7 Days)
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    
    // Create array for last 7 days
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toDateString();
        const dayName = days[d.getDay()];
        
        // Sum carbon for this specific date
        const dayTotal = recentActions
            .filter(a => new Date(a.timestamp).toDateString() === dateStr)
            .reduce((sum, a) => sum + a.carbonSaved, 0);
            
        data.push({ name: dayName, kg: dayTotal, fullDate: dateStr });
    }
    return data;
  };

  const weeklyData = getWeeklyData();

  // 2. Calculate Category Breakdown
  const getCategoryData = () => {
      const categories: Record<string, number> = {
          'Transport': 0,
          'Food': 0,
          'Energy': 0,
          'Waste': 0
      };
      
      recentActions.forEach(a => {
          if (categories[a.category] !== undefined) {
              categories[a.category] += a.carbonSaved;
          }
      });
      
      return Object.keys(categories).map(key => ({
          name: key,
          value: categories[key]
      })).filter(item => item.value > 0);
  };

  const categoryData = getCategoryData();

  const CATEGORY_COLORS: Record<string, string> = {
      'Transport': '#3b82f6', // blue-500
      'Food': '#10b981',      // emerald-500
      'Energy': '#eab308',    // yellow-500
      'Waste': '#f97316'      // orange-500
  };

  return (
    <div className="p-4 space-y-6">
      {/* Daily Tip Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-20">
            <LeafIcon size={100} />
        </div>
        <h3 className="text-sm font-semibold opacity-90 mb-2 flex items-center gap-2">
            <TrendingUp size={16} /> Daily Eco-Insight
        </h3>
        <p className="text-lg font-medium leading-relaxed italic pr-4">"{tip}"</p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
          <h3 className="text-slate-800 font-bold text-lg">Your Impact</h3>
          <button 
            onClick={handleShareStats}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <Share2 size={14} /> Share
          </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label="Total Saved" 
          value={`${stats.totalCarbonSaved.toFixed(1)}kg`} 
          icon={<Flame className="text-orange-500" size={24} />}
          colorClass="bg-orange-50"
        />
        <StatCard 
          label="Streak" 
          value={`${stats.streakDays} Days`} 
          icon={<Trophy className="text-yellow-500" size={24} />}
          colorClass="bg-yellow-50"
        />
        <div onClick={onNavigateToRewards} className="cursor-pointer transition-transform active:scale-95">
            <StatCard 
            label="Redeem Points" 
            value={stats.points} 
            icon={<Droplets className="text-blue-500" size={24} />}
            colorClass="bg-blue-50 ring-1 ring-blue-100"
            />
        </div>
        <StatCard 
          label="Level" 
          value={stats.level} 
          icon={<div className="text-emerald-600 font-bold text-lg">Lvl</div>}
          colorClass="bg-emerald-50"
        />
      </div>

      {/* Active Challenges List */}
      {activeChallenges.length > 0 && (
        <div>
           <h3 className="text-slate-800 font-bold mb-3 px-1">Active Challenges</h3>
           <div className="space-y-3">
             {activeChallenges.map(challenge => (
               <div key={challenge.id} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                             <Award size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-700 text-sm block">{challenge.title}</span>
                            {challenge.isSponsored && <span className="text-[10px] text-yellow-600 font-semibold uppercase tracking-wide">Sponsored by {challenge.sponsorName}</span>}
                          </div>
                      </div>
                      <span className="text-[10px] font-semibold bg-slate-100 px-2 py-1 rounded-full text-slate-500">{challenge.daysLeft} days left</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-1">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{challenge.progress} / {challenge.target} {challenge.unit}</span>
                      <span>{Math.round((challenge.progress / challenge.target) * 100)}% Complete</span>
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Dynamic Weekly Bar Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-bold mb-4">Carbon Impact (Last 7 Days)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Saved']}
              />
              <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? '#10b981' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Premium Feature: Impact Breakdown Pie Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-slate-800 font-bold flex items-center gap-2">
                 <PieIcon size={18} className="text-purple-500" /> Impact Breakdown
             </h3>
             {stats.isPremium && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">Premium</span>}
         </div>

         {/* Chart Content (Blurred if not premium) */}
         <div className={`h-48 w-full transition-all duration-300 ${!stats.isPremium ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
             {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#cbd5e1'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
                    </PieChart>
                </ResponsiveContainer>
             ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                     Log actions to see breakdown
                 </div>
             )}
         </div>

         {/* Lock Overlay for Non-Premium Users */}
         {!stats.isPremium && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/30 backdrop-blur-[1px]">
                 <div className="bg-white p-4 rounded-xl shadow-lg border border-purple-100 text-center max-w-[80%]">
                     <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
                         <Lock size={20} />
                     </div>
                     <h4 className="font-bold text-slate-800 text-sm mb-1">Premium Feature</h4>
                     <p className="text-xs text-slate-500 mb-3">Unlock detailed category analytics to see where you save the most.</p>
                     <div className="text-xs font-bold text-purple-600">Visit Profile to Upgrade</div>
                 </div>
             </div>
         )}
      </div>

      {/* Recent Activity Feed */}
      <div>
        <h3 className="text-slate-800 font-bold mb-3 px-1">Recent Activity</h3>
        <div className="space-y-3">
          {recentActions.slice(0, 3).map((action) => (
            <div key={action.id} className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl">
                        {action.category === 'Transport' ? '🚲' : action.category === 'Food' ? '🥗' : '🌱'}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700">{action.name}</p>
                        <p className="text-xs text-slate-400">{action.timestamp.toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-emerald-600 font-bold text-sm">
                    -{action.carbonSaved}kg CO₂
                </div>
            </div>
          ))}
          {recentActions.length === 0 && (
            <p className="text-slate-400 text-center py-4 text-sm">No actions logged yet. Start today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const LeafIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.457 2.80869C17.457 2.80869 10.787 5.22869 6.44697 11.2387C3.12697 15.8287 4.19697 21.3687 4.19697 21.3687 4.19697 21.3687 9.80697 22.1887 14.227 18.5287C17.077 16.1687 18.237 13.0487 18.577 11.2387" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M6.55697 11.3387C7.30697 12.0887 11.727 15.7187 14.197 18.5587" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export default Dashboard;