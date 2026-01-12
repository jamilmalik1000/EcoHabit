export interface UserAction {
  id: string;
  actionId: string;
  name: string;
  category: 'Transport' | 'Food' | 'Energy' | 'Waste';
  carbonSaved: number; // in kg
  timestamp: Date;
}

export interface EcoAction {
  id: string;
  name: string;
  category: 'Transport' | 'Food' | 'Energy' | 'Waste';
  icon: string;
  baseCarbonSaving: number; // estimated kg CO2e
}

export interface UserStats {
  totalCarbonSaved: number;
  streakDays: number;
  points: number;
  level: number;
  isPremium: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  progress: number;
  daysLeft: number;
  participants: number;
  isJoined?: boolean;
  sponsorName?: string; // For B2B monetization
  isSponsored?: boolean;
}

export interface Reward {
  id: string;
  brandName: string;
  description: string;
  cost: number;
  discountCode: string;
  logo: string;
  affiliateUrl: string; // For affiliate commissions
}

export interface ForumPost {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  likes: number;
  timestamp: Date;
  isAi?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isMapResult?: boolean;
}

export interface EcoReport {
  id: string;
  category: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  locationName: string;
  timestamp: Date;
  aiAnalysis?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'alert' | 'success' | 'info';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: Date;
  isLocked: boolean;
}

export enum Page {
  DASHBOARD = 'dashboard',
  LOG = 'log',
  COMMUNITY = 'community',
  ASSISTANT = 'assistant',
  LOCATE = 'locate',
  PROFILE = 'profile',
  REWARDS = 'rewards'
}