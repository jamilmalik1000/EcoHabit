import { EcoAction, Challenge, Badge, Reward } from './types';

export const AVAILABLE_ACTIONS: EcoAction[] = [
  { id: '1', name: 'Cycled to Work', category: 'Transport', icon: '🚲', baseCarbonSaving: 2.5 },
  { id: '2', name: 'Meatless Meal', category: 'Food', icon: '🥗', baseCarbonSaving: 1.8 },
  { id: '3', name: 'Reusable Bottle', category: 'Waste', icon: '🥤', baseCarbonSaving: 0.2 },
  { id: '4', name: 'Cold Wash', category: 'Energy', icon: '🧺', baseCarbonSaving: 0.5 },
  { id: '5', name: 'Public Transport', category: 'Transport', icon: '🚌', baseCarbonSaving: 1.5 },
  { id: '6', name: 'Composted Waste', category: 'Waste', icon: '🌱', baseCarbonSaving: 0.3 },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Plastic Free July',
    description: 'Avoid single-use plastics for the entire month.',
    target: 30,
    unit: 'days',
    progress: 12,
    daysLeft: 18,
    participants: 1240,
  },
  {
    id: 'c2',
    title: 'Bike Commuter',
    description: 'Cycle to work or school 10 times this month.',
    target: 10,
    unit: 'rides',
    progress: 4,
    daysLeft: 10,
    participants: 850,
  },
  {
    id: 'c3',
    title: 'Tree Planting Drive',
    description: 'Join us to plant 10,000 trees this weekend! Sponsored by GreenCorp.',
    target: 1,
    unit: 'event',
    progress: 0,
    daysLeft: 5,
    participants: 3200,
    isSponsored: true,
    sponsorName: 'GreenCorp'
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'r1',
    brandName: 'EcoWear',
    description: '20% off sustainable activewear.',
    cost: 500,
    discountCode: 'HABIT20',
    logo: '👕',
    affiliateUrl: '#'
  },
  {
    id: 'r2',
    brandName: 'BambooLife',
    description: 'Free bamboo toothbrush set with purchase.',
    cost: 300,
    discountCode: 'BAMBOOFREE',
    logo: '🎋',
    affiliateUrl: '#'
  },
  {
    id: 'r3',
    brandName: 'SolarGadgets',
    description: '$15 gift card for solar chargers.',
    cost: 1000,
    discountCode: 'SOLAR15',
    logo: '☀️',
    affiliateUrl: '#'
  },
  {
    id: 'r4',
    brandName: 'ZeroWaste Home',
    description: '10% off your first bulk grocery order.',
    cost: 250,
    discountCode: 'ZERO10',
    logo: '🛍️',
    affiliateUrl: '#'
  }
];

export const MOCK_BADGES: Badge[] = [
    {
        id: 'b1',
        name: 'Early Adopter',
        description: 'Joined EcoHabit in the first month.',
        icon: '🌟',
        earnedDate: new Date('2024-01-15'),
        isLocked: false
    },
    {
        id: 'b2',
        name: 'Carbon Crusher',
        description: 'Saved over 100kg of CO2.',
        icon: '🌳',
        earnedDate: new Date('2024-03-10'),
        isLocked: false
    },
    {
        id: 'b3',
        name: 'Streak Master',
        description: 'Log actions for 30 days in a row.',
        icon: '🔥',
        isLocked: true
    },
    {
        id: 'b4',
        name: 'Community Star',
        description: 'Receive 50 likes on your forum posts.',
        icon: '💬',
        isLocked: true
    }
];

export const INITIAL_STATS = {
  totalCarbonSaved: 145.2,
  streakDays: 5,
  points: 1250,
  level: 3,
  isPremium: false,
};