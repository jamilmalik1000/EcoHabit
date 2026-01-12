import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ActionLogger from './components/ActionLogger';
import Community from './components/Community';
import Assistant from './components/Assistant';
import EcoFinder from './components/EcoFinder';
import Profile from './components/Profile';
import Rewards from './components/Rewards';
import { Page, UserAction, EcoAction, UserStats, Badge, Notification, Challenge, Reward } from './types';
import { INITIAL_STATS, MOCK_BADGES, MOCK_CHALLENGES, MOCK_REWARDS } from './constants';

const STORAGE_KEY = 'ecohabit_data_v1';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  
  // App State
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [actions, setActions] = useState<UserAction[]>([]);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Daily Goal', message: 'Remember to log your plastic-free lunch!', time: '2h ago', isRead: false, type: 'info' },
    { id: '2', title: 'New Challenge', message: 'The "Walk to Work" challenge has started.', time: '5h ago', isRead: false, type: 'success' },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Data from LocalStorage
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Hydrate Dates
          if (parsed.actions) {
            parsed.actions = parsed.actions.map((a: any) => ({
              ...a,
              timestamp: new Date(a.timestamp)
            }));
          }
          if (parsed.badges) {
            parsed.badges = parsed.badges.map((b: any) => ({
              ...b,
              earnedDate: b.earnedDate ? new Date(b.earnedDate) : undefined
            }));
          }

          if (parsed.stats) setStats(parsed.stats);
          if (parsed.actions) setActions(parsed.actions);
          if (parsed.badges) setBadges(parsed.badges);
          if (parsed.challenges) setChallenges(parsed.challenges);
          if (parsed.notifications) setNotifications(parsed.notifications);
          
          // If we have saved data, skip landing
          setView('app');
        } catch (e) {
          console.error("Failed to load save data", e);
        }
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Save Data to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    // Only save if we are in the app view to avoid saving empty state over existing data prematurely
    if (view === 'app') {
        const dataToSave = {
        stats,
        actions,
        badges,
        challenges,
        notifications
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [stats, actions, badges, challenges, notifications, isLoaded, view]);

  const handleLogin = () => {
      setView('app');
      setCurrentPage(Page.DASHBOARD);
  };

  const handleLogout = () => {
      setView('landing');
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure? This will delete all your progress, points, and logs.")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert') => {
      const newNotif: Notification = {
          id: Date.now().toString(),
          title,
          message,
          time: 'Just now',
          isRead: false,
          type
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const checkForBadges = (currentStats: UserStats, currentActions: UserAction[]) => {
      const newBadges = [...badges];
      let unlocked = false;

      // Logic: Carbon Crusher (Saved > 150kg)
      const carbonBadgeIndex = newBadges.findIndex(b => b.id === 'b2');
      if (carbonBadgeIndex !== -1 && newBadges[carbonBadgeIndex].isLocked) {
          if (currentStats.totalCarbonSaved >= 150) {
              newBadges[carbonBadgeIndex] = {
                  ...newBadges[carbonBadgeIndex],
                  isLocked: false,
                  earnedDate: new Date()
              };
              unlocked = true;
              addNotification('Badge Unlocked!', `You earned "Carbon Crusher" for saving over 150kg of CO₂!`, 'success');
          }
      }

      // Logic: Streak Master (Streak >= 10)
      const streakBadgeIndex = newBadges.findIndex(b => b.id === 'b3');
      if (streakBadgeIndex !== -1 && newBadges[streakBadgeIndex].isLocked) {
          if (currentStats.streakDays >= 10) {
               newBadges[streakBadgeIndex] = {
                  ...newBadges[streakBadgeIndex],
                  isLocked: false,
                  earnedDate: new Date()
              };
              unlocked = true;
              addNotification('Badge Unlocked!', `You earned "Streak Master" for a 10-day streak!`, 'success');
          }
      }

      if (unlocked) {
          setBadges(newBadges);
      }
  };

  const handleLogAction = (ecoAction: EcoAction) => {
    const newAction: UserAction = {
      id: Date.now().toString(),
      actionId: ecoAction.id,
      name: ecoAction.name,
      category: ecoAction.category,
      carbonSaved: ecoAction.baseCarbonSaving,
      timestamp: new Date(),
    };

    setActions(prev => [newAction, ...prev]);
    
    setStats(prev => {
        const newStats = {
            ...prev,
            totalCarbonSaved: prev.totalCarbonSaved + ecoAction.baseCarbonSaving,
            points: prev.points + 10,
            streakDays: prev.streakDays + 1
        };
        checkForBadges(newStats, [newAction, ...actions]);
        return newStats;
    });
    
    setCurrentPage(Page.DASHBOARD);
    addNotification('Action Logged', `Saved ${ecoAction.baseCarbonSaving}kg CO₂`, 'success');
  };

  const handleJoinChallenge = (challengeId: string) => {
      setChallenges(prev => prev.map(c => 
          c.id === challengeId ? { ...c, isJoined: true, participants: c.participants + 1 } : c
      ));
      addNotification('Challenge Joined', 'Good luck! Track your progress on the dashboard.', 'success');
  };

  const handleAddChallenge = (newChallenge: Challenge) => {
      setChallenges(prev => [newChallenge, ...prev]);
      addNotification('Campaign Created', `"${newChallenge.title}" is now active!`, 'success');
  };

  const handleRedeemReward = (reward: Reward) => {
    if (stats.points >= reward.cost) {
      setStats(prev => ({ ...prev, points: prev.points - reward.cost }));
      addNotification('Reward Redeemed', `You redeemed ${reward.brandName}. Check the card for code.`, 'success');
    }
  };

  const handleUpgradePremium = () => {
    if (window.confirm("Confirm subscription for $2.99/month?")) {
      setStats(prev => ({ ...prev, isPremium: true }));
      addNotification('Welcome to Premium!', 'You now have access to exclusive features.', 'success');
    }
  };

  // --- Render Logic ---

  if (view === 'landing') {
      return <LandingPage onGetStarted={() => setView('auth')} />;
  }

  if (view === 'auth') {
      return <Auth onLogin={handleLogin} />;
  }

  // App View
  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard 
          stats={stats} 
          recentActions={actions} 
          challenges={challenges} 
          onNavigateToRewards={() => setCurrentPage(Page.REWARDS)} 
        />;
      case Page.LOG:
        return <ActionLogger onLogAction={handleLogAction} />;
      case Page.COMMUNITY:
        return <Community 
            challenges={challenges} 
            onJoinChallenge={handleJoinChallenge} 
            onAddChallenge={handleAddChallenge}
        />;
      case Page.ASSISTANT:
        return <Assistant />;
      case Page.LOCATE:
        return <EcoFinder />;
      case Page.PROFILE:
        return <Profile 
          stats={stats} 
          badges={badges} 
          onLogout={handleLogout} 
          onUpgrade={handleUpgradePremium}
          onResetData={handleResetData}
        />;
      case Page.REWARDS:
        return <Rewards 
          stats={stats} 
          rewards={MOCK_REWARDS} 
          onRedeem={handleRedeemReward} 
        />;
      default:
        return <Dashboard 
          stats={stats} 
          recentActions={actions} 
          challenges={challenges} 
          onNavigateToRewards={() => setCurrentPage(Page.REWARDS)} 
        />;
    }
  };

  return (
    <Layout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;