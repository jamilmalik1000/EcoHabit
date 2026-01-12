import React from 'react';
import { Leaf, ArrowRight, Globe, ShieldCheck, Users, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
           <div className="bg-emerald-100 p-2 rounded-lg">
             <Leaf className="text-emerald-600" size={20} />
           </div>
           <span className="text-xl font-bold text-slate-800 tracking-tight">EcoHabit</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <Globe size={12} /> #1 Sustainability App
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Small habits. <br/>
          <span className="text-emerald-600">Global Impact.</span>
        </h1>
        
        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Track your carbon footprint, compete in community challenges, and earn rewards for living sustainably.
        </p>
        
        <button 
          onClick={onGetStarted}
          className="group bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300"
        >
          Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
        </button>
        
        <div className="mt-12 flex items-center gap-4 text-sm text-slate-400 font-medium animate-in fade-in delay-500">
           <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
              ))}
           </div>
           <p>Join 10,000+ Eco-Warriors</p>
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-slate-50 py-20 px-6">
         <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-slate-800 mb-4">Why EcoHabit?</h2>
                 <p className="text-slate-500">Everything you need to make a difference, right in your pocket.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                 <FeatureCard 
                    icon={<TrendingUp />}
                    title="Track Impact"
                    desc="Log daily actions and visualize your carbon savings over time."
                 />
                 <FeatureCard 
                    icon={<Users />}
                    title="Community"
                    desc="Join challenges, share tips, and compete on the leaderboard."
                 />
                 <FeatureCard 
                    icon={<ShieldCheck />}
                    title="Earn Rewards"
                    desc="Get exclusive discounts from sustainable brands for your efforts."
                 />
             </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-6 text-center border-t border-slate-100">
         <p className="text-slate-400 text-sm">© 2024 EcoHabit. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({icon, title, desc}: {icon: React.ReactNode, title: string, desc: string}) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;