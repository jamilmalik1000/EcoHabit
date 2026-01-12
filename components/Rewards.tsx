import React, { useState } from 'react';
import { Reward, UserStats } from '../types';
import { ShoppingBag, Lock, ExternalLink, CheckCircle } from 'lucide-react';

interface RewardsProps {
  stats: UserStats;
  rewards: Reward[];
  onRedeem: (reward: Reward) => void;
}

const Rewards: React.FC<RewardsProps> = ({ stats, rewards, onRedeem }) => {
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  const handleRedeemClick = (reward: Reward) => {
    if (stats.points >= reward.cost && !redeemed.has(reward.id)) {
      onRedeem(reward);
      setRedeemed(prev => new Set(prev).add(reward.id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-emerald-600" /> Eco Rewards
          </h2>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold text-sm">
            {stats.points} pts
          </div>
        </div>
        <p className="text-slate-500 text-sm">Redeem your points for exclusive discounts from sustainable brands.</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto pb-20">
        {rewards.map((reward) => {
          const isRedeemed = redeemed.has(reward.id);
          const canAfford = stats.points >= reward.cost;

          return (
            <div key={reward.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                    {reward.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{reward.brandName}</h3>
                    <p className="text-xs text-slate-500 mt-1">{reward.cost} points</p>
                  </div>
                </div>
                
                {isRedeemed ? (
                  <span className="bg-green-100 text-green-700 p-2 rounded-full">
                    <CheckCircle size={20} />
                  </span>
                ) : (
                   <div className="text-right">
                       {!canAfford && <Lock size={16} className="text-slate-300 inline-block" />}
                   </div>
                )}
              </div>

              <p className="text-sm text-slate-600 mt-3 mb-4">{reward.description}</p>

              {isRedeemed ? (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 animate-in fade-in">
                  <p className="text-xs text-emerald-800 font-bold mb-1">Discount Code:</p>
                  <div className="flex justify-between items-center">
                    <code className="text-lg font-mono text-emerald-700 select-all">{reward.discountCode}</code>
                    <a 
                      href={reward.affiliateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 text-emerald-600 hover:underline"
                    >
                      Visit Store <ExternalLink size={12}/>
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleRedeemClick(reward)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
                    canAfford
                      ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem Reward' : `Need ${reward.cost - stats.points} more pts`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;